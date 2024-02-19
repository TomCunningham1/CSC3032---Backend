import {
  Duration,
  NestedStack,
  NestedStackProps,
  aws_ec2,
  aws_lambda,
  aws_lambda_nodejs,
  aws_rds,
  aws_secretsmanager,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import environment from '../config/environment'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'

export class Team11RdsStack extends NestedStack {
  public readonly databaseEnvironmentVariables: any
  public readonly rdsInstance: any
  public readonly createSchemaLambda: NodejsFunction
  public readonly insertDataLambda: NodejsFunction

  constructor(scope: Construct, id: string, props: NestedStackProps) {
    super(scope, 'Team11-Database-Stack')

    // Virtual Private Cloud

    const vpc = aws_ec2.Vpc.fromLookup(this, 'vpc', {
      isDefault: true,
    })

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

    this.rdsInstance = new aws_rds.DatabaseInstance(
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
        databaseName: environment.databaseName,
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

    this.databaseEnvironmentVariables = {
      USERNAME: databaseSecret
        .secretValueFromJson('username')
        .unsafeUnwrap()
        .toString(),
      PASSWORD: databaseSecret
        .secretValueFromJson('password')
        .unsafeUnwrap()
        .toString(),
      HOST: environment.hostName,
      DATABASE: environment.databaseName,
    }

    // Create schema lambda
    // Fires automatically when database is created
    this.createSchemaLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-create-schema`,
      {
        functionName: `team11-${environment.abbr}-create-schema`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/database/create-schema.ts',
        handler: 'handler',
        environment: {
          ...this.databaseEnvironmentVariables,
        },
      }
    )

    // Insert data lambda
    // Fires automatically when the database is created
    this.insertDataLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-insert-data`,
      {
        functionName: `team11-${environment.abbr}-insert-data`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/database/insert-data.ts',
        handler: 'handler',
        environment: {
          ...this.databaseEnvironmentVariables,
        },
      }
    )

    // Adds a dependency on the RDS database.
    // createSchemaLambda will only be created once the database has been created
    this.createSchemaLambda.node.addDependency(this.rdsInstance)

    // Adds a dependency on the create schema lambda
    // This lambda will only create once the create schema lambda has been created.
    this.insertDataLambda.node.addDependency(this.createSchemaLambda)
  }
}
