import { 
  aws_apigateway,
  aws_ec2,
  aws_lambda,
  aws_rds, 
  Duration, 
  Stack, 
  StackProps 
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class Team11BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?:  StackProps) {
    super(scope, id, props);

    // Iam Roles



    // Virtual Private Cloud

    const vpc = new aws_ec2.Vpc(this, 'backend-vpc', {
      vpcName: 'backend-vpc',
      maxAzs: 2,
    });



    //  ------ Lambda Functions ------- 

    // Health lambda 

    const healthLambda = new aws_lambda.Function(this, 'backend-health', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: 'health.handler',
      code: aws_lambda.Code.fromAsset('lib/api')
    });

    const healthLambdaIntegration = new aws_apigateway.LambdaIntegration(healthLambda);

    // Login Lambda
    
    const loginLambda = new aws_lambda.Function(this, 'backend-login', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: 'login.handler',
      code: aws_lambda.Code.fromAsset('lib/api')
    })

    const loginLambdaIntegration = new aws_apigateway.LambdaIntegration(loginLambda);

    // Database

    const rdsInstance = new aws_rds.DatabaseInstance(this, 'mysql-database', {
      vpc: vpc,
      engine: aws_rds.DatabaseInstanceEngine.MYSQL,
      instanceIdentifier: 'mysql-database',
      allocatedStorage: 10,
      maxAllocatedStorage: 10,
      deleteAutomatedBackups: true,
      backupRetention: Duration.millis(0),
      credentials: aws_rds.Credentials.fromUsername('libraryadmin'),
      publiclyAccessible: false,
    });

    // API Gateway

    const apiGateway = new aws_apigateway.RestApi(this, 'backend-apigw', {
    });
    
    const rootUrl = apiGateway.root.addResource('team11') // <-- Update to app name

    const healthUrl = rootUrl.addResource('health').addMethod('GET', healthLambdaIntegration);

    const loginUrl = rootUrl.addResource('login').addMethod('GET', loginLambdaIntegration) // <-- Should be post

  }
}
