import {
  aws_apigateway,
  aws_ec2,
  aws_lambda,
  aws_lambda_nodejs,
  aws_rds,
  aws_secretsmanager,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import EMAIL_MODEL from './models/email-model'
import { emailRequestValidator } from './config/validators'
import environment from './config/environment'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'
import { IAM } from 'aws-sdk'
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam'

export class Team11BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Virtual Private Cloud

    const vpc = aws_ec2.Vpc.fromLookup(this, 'vpc', {
      isDefault: true,
    })

    // Secret Value

    const databaseSecret = new aws_secretsmanager.Secret(
      this,
      'database-secret',
      {
        generateSecretString: {
          secretStringTemplate: JSON.stringify({ username: 'adminUser' }),
          generateStringKey: 'password',
          excludeCharacters: '/@"',
        },
      }
    )

    // Database

    const securityGroup = new aws_ec2.SecurityGroup(this, 'mysql-database-sg', {
      vpc,
      description: 'Allow public connections',
    })

    securityGroup.addIngressRule(
      aws_ec2.Peer.ipv4('0.0.0.0/0'),
      aws_ec2.Port.tcp(3306)
    )
    securityGroup.addIngressRule(
      aws_ec2.Peer.anyIpv4(),
      aws_ec2.Port.allTraffic()
    )

    const rdsInstance = new aws_rds.DatabaseInstance(
      this,
      `team11-${environment.environmentName}-database`,
      {
        vpc: vpc,
        engine: aws_rds.DatabaseInstanceEngine.MYSQL,
        instanceIdentifier: `team11-${environment.environmentName}-database`,
        allocatedStorage: 10,
        instanceType: aws_ec2.InstanceType.of(
          aws_ec2.InstanceClass.T3,
          aws_ec2.InstanceSize.MICRO
        ),
        maxAllocatedStorage: 10,
        //databaseName: environment.databaseName,
        deleteAutomatedBackups: true,
        backupRetention: Duration.millis(0),
        credentials: {
          username: databaseSecret
            .secretValueFromJson('username')
            .unsafeUnwrap()
            .toString(),
          password: databaseSecret.secretValueFromJson('password'),
        },
        securityGroups: [securityGroup],
        publiclyAccessible: true,
        vpcSubnets: {
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
      }
    )

    // Get Secret

    const secret = aws_secretsmanager.Secret.fromSecretAttributes(
      this,
      'ImportedSecret',
      {
        secretCompleteArn:
          'arn:aws:secretsmanager:eu-west-1:394261647652:secret:databasesecret6A44CD8F-Wk9XSvKVBbLc-cjE3XH',
      }
    )

    //  ------ Lambda Functions -------

    const healthLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.environmentName}-health`,
      {
        functionName: 'health',
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/health.ts',
        handler: 'handler',
      }
    )

    const healthLambdaIntegration = new aws_apigateway.LambdaIntegration(
      healthLambda
    )

    const createSchemaLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'create-schema',
      {
        functionName: 'create-schema',
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/database/create-schema.ts',
        handler: 'handler',
        environment: {
          USERNAME: databaseSecret
            .secretValueFromJson('username')
            .unsafeUnwrap()
            .toString(),
          PASSWORD: databaseSecret
            .secretValueFromJson('password')
            .unsafeUnwrap()
            .toString(),
        },
      }
    )

    const insertDataLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      'insert-data',
      {
        functionName: 'insert-data',
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/database/insert-data.ts',
        handler: 'handler',
        environment: {
          USERNAME: databaseSecret
            .secretValueFromJson('username')
            .unsafeUnwrap()
            .toString(),
          PASSWORD: databaseSecret
            .secretValueFromJson('password')
            .unsafeUnwrap()
            .toString(),
        },
      }
    )

    // Email Lambda

    const emailLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.environmentName}-email`,
      {
        functionName: 'email',
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/email.ts',
        handler: 'handler',
        tracing: aws_lambda.Tracing.ACTIVE,
      }
    )

    const emailLambdaIntegration = new aws_apigateway.LambdaIntegration(
      emailLambda
    )

    // API Gateway

    const apiGateway = new aws_apigateway.RestApi(
      this,
      `team11-${environment.environmentName}-api-gateway`,
      {
        defaultCorsPreflightOptions: {
          allowOrigins: aws_apigateway.Cors.ALL_ORIGINS,
          allowMethods: aws_apigateway.Cors.ALL_METHODS,
        },
      }
    )

    const apiEmailModel = apiGateway.addModel('EmailModel', EMAIL_MODEL)

    const apiEmailValidator = apiGateway.addRequestValidator(
      'EmailRequestValidator',
      emailRequestValidator
    )

    const rootUrl = apiGateway.root.addResource('team11') // <-- Update to app name

    const healthUrl = rootUrl
      .addResource('health')
      .addMethod('GET', healthLambdaIntegration)

    const emailUrl = rootUrl
      .addResource('send-email')
      .addMethod('POST', emailLambdaIntegration, {
        requestValidator: apiEmailValidator,
        requestModels: { 'application/json': apiEmailModel },
      })

    new AwsCustomResource(this, 'CreateSchemaTrigger', {
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          effect: Effect.ALLOW,
          resources: [createSchemaLambda.functionArn],
        }),
      ]),
      timeout: Duration.minutes(2),
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: createSchemaLambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
      },
      onUpdate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: createSchemaLambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
      },
    })

    new AwsCustomResource(this, 'InsertDataTrigger', {
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          effect: Effect.ALLOW,
          resources: [insertDataLambda.functionArn],
        }),
      ]),
      timeout: Duration.minutes(2),
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: insertDataLambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
      },
      onUpdate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: insertDataLambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
      },
    })
  }
}
