import {
  NestedStack,
  NestedStackProps,
  aws_apigateway,
  aws_lambda,
  aws_lambda_nodejs,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import environment from '../config/environment'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'

interface ResultsNestedStackProps extends NestedStackProps {
  databaseEnvironmentVariables: any
}

export class Team11ResultsStack extends NestedStack {
  public readonly emailLambdaIntegration: LambdaIntegration
  public readonly saveResultsLambdaIntegration: LambdaIntegration
  public readonly getResultsLambdaIntegration: LambdaIntegration

  constructor(scope: Construct, id: string, props: ResultsNestedStackProps) {
    super(scope, 'Team11-Results-Stack')

    // Email lambda
    // Used to email results to users
    const emailLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-email`,
      {
        functionName: `team11-${environment.abbr}-email`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/email.ts',
        handler: 'handler',
        tracing: aws_lambda.Tracing.ACTIVE, // XRay tracing enabled to investigate delays in lambda
      }
    )

    // api gateway integration for email lambda
    this.emailLambdaIntegration = new aws_apigateway.LambdaIntegration(
      emailLambda
    )

    // Get Results Lambda
    // Gets the top set of results from the database
    const getResultsLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-get-results`,
      {
        functionName: `team11-${environment.abbr}-get-results`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/getResults.ts',
        handler: 'handler',
        environment: {
          ...props.databaseEnvironmentVariables,
        },
      }
    )

    // api gateway integration for get results lambda
    this.getResultsLambdaIntegration = new aws_apigateway.LambdaIntegration(
      getResultsLambda
    )

    // Save Results Lambda
    // Adds the results of a user to the database
    const saveResultsLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-save-results`,
      {
        functionName: `team11-${environment.abbr}-save-results`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/saveResults.ts',
        handler: 'handler',
        environment: {
          ...props.databaseEnvironmentVariables,
        },
      }
    )
    this.saveResultsLambdaIntegration = new aws_apigateway.LambdaIntegration(
      saveResultsLambda
    )
  }
}
