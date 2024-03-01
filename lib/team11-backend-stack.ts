import {
  aws_apigateway,
  aws_lambda,
  aws_lambda_nodejs,
  Duration,
  Stack,
  StackProps,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import EMAIL_MODEL from './models/email-model'
import {
  emailRequestValidator,
  saveResultsRequestValidator,
} from './config/validators'
import SAVE_RESULTS_MODEL from './models/save-results-model'
import environment from './config/environment'
import { Team11RdsStack } from './stacks/team11-rds-stack'
import { Team11ResultsStack } from './stacks/team11-results-stack'
import { Team11AdminStack } from './stacks/team11-admin-stack'
import { PolicyStatement, Effect } from 'aws-cdk-lib/aws-iam'
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from 'aws-cdk-lib/custom-resources'

export class Team11BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    //  --- Create Nested Stacks ---

    // Database stack contains RDS database, VPC and Security group
    const databaseStack = new Team11RdsStack(this, 'team11-rds-stack', {})

    // Results Stack handles storing players results.
    const resultsStack = new Team11ResultsStack(this, 'team11-results-stack', {
      databaseEnvironmentVariables: databaseStack.databaseEnvironmentVariables,
    })

    // Admin Stack handles storing, adding and deleting playthroughs
    const adminStack = new Team11AdminStack(this, 'team11-admin-stack', {
      databaseEnvironmentVariables: databaseStack.databaseEnvironmentVariables,
    })

    //  ------ Lambda Functions -------

    // Health Lambda
    const healthLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-health`,
      {
        functionName: `team11-${environment.abbr}-backend-health`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/health.ts',
        handler: 'handler',
      }
    )

    const healthLambdaIntegration = new aws_apigateway.LambdaIntegration(
      healthLambda
    )

    // ------------- API Gateway ---------------

    // Initialise Rest API and add CORS methods
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

    // Create an API key
    const apiKey = new aws_apigateway.ApiKey(
      this,
      `team11-${environment.abbr}-api-key`,
      {
        description: 'My API Key',
        enabled: true, // Set to true to enable the API key
      }
    )

    const apiKeyUsagePlan = apiGateway
      .addUsagePlan(`team11-${environment.abbr}-api-key-usage-plan`, {
        name: `team11-${environment.abbr}-api-key-usage-plan`,
        apiStages: [{ stage: apiGateway.deploymentStage }],
      })
      .addApiKey(apiKey)

    // Root url stores the base url of the api
    const rootUrl = apiGateway.root

    // Health test to verify the api is online
    const healthUrl = rootUrl
      .addResource('health')
      .addMethod('GET', healthLambdaIntegration)

    // -------- Results Stack --------

    // Email Model specifies the format for requests to the email endpoint
    const apiEmailModel = apiGateway.addModel('EmailModel', EMAIL_MODEL)

    // Email Validator specifies what parts of the request to validate
    const apiEmailValidator = apiGateway.addRequestValidator(
      'EmailRequestValidator',
      emailRequestValidator
    )

    // Specifies format for requests to the results endpoint
    const apiSaveResultsModel = apiGateway.addModel(
      'SaveResultsModel',
      SAVE_RESULTS_MODEL
    )

    // Specifies parts of request to validate
    const apiSaveResultsValidator = apiGateway.addRequestValidator(
      'SaveResultsRequestValidator',
      saveResultsRequestValidator
    )

    const secureEndpointConfig = {
      apiKeyRequired: true,
    }

    // Results Stack Routes

    const resultsUrl = rootUrl.addResource('results')

    resultsUrl
      .addResource('send-email')
      .addMethod('POST', resultsStack.emailLambdaIntegration, {
        requestValidator: apiEmailValidator,
        requestModels: { 'application/json': apiEmailModel },
        ...secureEndpointConfig,
      })

    resultsUrl
      .addResource('save-results')
      .addMethod('POST', resultsStack.saveResultsLambdaIntegration, {
        requestValidator: apiSaveResultsValidator,
        requestModels: { 'application/json': apiSaveResultsModel },
        ...secureEndpointConfig,
      })

    resultsUrl
      .addResource('get-results')
      .addMethod(
        'POST',
        resultsStack.getResultsLambdaIntegration,
        secureEndpointConfig
      )

    // Admin Stack Routes

    const adminUrl = rootUrl.addResource('admin')

    adminUrl
      .addResource('get-questions')
      .addMethod(
        'GET',
        adminStack.getQuestionsLambdaIntegration,
        secureEndpointConfig
      )

    adminUrl
      .addResource('read')
      .addMethod('GET', adminStack.readLambdaIntegration, secureEndpointConfig)

    adminUrl
      .addResource('write')
      .addMethod(
        'POST',
        adminStack.writeLambdaIntegration,
        secureEndpointConfig
      )

    adminUrl
      .addResource('get-all')
      .addMethod(
        'GET',
        adminStack.getAllLambdaIntegration,
        secureEndpointConfig
      )

    adminUrl
      .addResource('delete')
      .addMethod(
        'GET',
        adminStack.deleteLambdaIntegration,
        secureEndpointConfig
      )

    adminUrl
      .addResource('reset-leaderboard')
      .addMethod(
        'GET',
        adminStack.resetLeaderboardLambdaIntegration,
        secureEndpointConfig
      )

    // Triggers

    const createTrigger = new AwsCustomResource(this, 'CreateSchemaTrigger', {
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          effect: Effect.ALLOW,
          resources: [databaseStack.createSchemaLambda.functionArn],
        }),
      ]),
      timeout: Duration.minutes(2),
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: databaseStack.createSchemaLambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
      },
    })

    const insertTrigger = new AwsCustomResource(this, 'InsertDataTrigger', {
      policy: AwsCustomResourcePolicy.fromStatements([
        new PolicyStatement({
          actions: ['lambda:InvokeFunction'],
          effect: Effect.ALLOW,
          resources: [databaseStack.insertDataLambda.functionArn],
        }),
      ]),
      timeout: Duration.minutes(2),
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: databaseStack.insertDataLambda.functionName,
          InvocationType: 'Event',
        },
        physicalResourceId: PhysicalResourceId.of(Date.now().toString()),
      },
    })
  }
}
