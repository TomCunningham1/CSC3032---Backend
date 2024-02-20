import {
  NestedStack,
  NestedStackProps,
  RemovalPolicy,
  aws_apigateway,
  aws_dynamodb,
  aws_lambda,
  aws_lambda_nodejs,
} from 'aws-cdk-lib'
import { Construct } from 'constructs'
import environment from '../config/environment'
import { LambdaIntegration } from 'aws-cdk-lib/aws-apigateway'

interface ResultsNestedStackProps extends NestedStackProps {
  databaseEnvironmentVariables: any
}

export class Team11AdminStack extends NestedStack {

  public readonly writeLambdaIntegration: LambdaIntegration
  public readonly readLambdaIntegration: LambdaIntegration
  public readonly getAllLambdaIntegration: LambdaIntegration
  public readonly deleteLambdaIntegration: LambdaIntegration
  public readonly resetLeaderboardLambdaIntegration: LambdaIntegration

  constructor(scope: Construct, id: string, props: ResultsNestedStackProps) {
    super(scope, 'team11-admin-stack', props)

    const environmentVariables = {
      TABLE_NAME: environment.dynamodbTableName,
    }
    // Write Lambda
    const writeLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-write-scenario`,
      {
        functionName: `team11-${environment.abbr}-write-scenario`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/write.ts',
        handler: 'handler',
        environment: {
          ...environmentVariables,
          ...props.databaseEnvironmentVariables
        },
      }
    )

    this.writeLambdaIntegration = new aws_apigateway.LambdaIntegration(
      writeLambda
    )

    const readLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-read-scenario`,
      {
        functionName: `team11-${environment.abbr}-read-scenario`,
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/read.ts',
        handler: 'handler',
        environment: {
          ...environmentVariables,
        },
      }
    )

    this.readLambdaIntegration = new aws_apigateway.LambdaIntegration(
      readLambda
    )

    const getAllLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-get-all-scenario`,
      {
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/getAll.ts',
        handler: 'handler',
        environment: {
          ...environmentVariables,
        },
      }
    )

    this.getAllLambdaIntegration = new aws_apigateway.LambdaIntegration(
      getAllLambda
    )

    // Delete Lambda

    const deleteLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-delete-scenario`,
      {
        runtime: aws_lambda.Runtime.NODEJS_18_X,
        entry: 'lib/api/delete.ts',
        handler: 'handler',
        environment: {
          ...environmentVariables,
          ...props.databaseEnvironmentVariables
        },
      }
    )

    this.deleteLambdaIntegration = new aws_apigateway.LambdaIntegration(
      deleteLambda
    )

    // Reset Leaderboard Lambda

    const resetLeaderboardLambda = new aws_lambda_nodejs.NodejsFunction(
      this,
      `team11-${environment.abbr}-reset-leaderboard`,
      {
        functionName: `team11-${environment.abbr}-reset-leaderboard`,
        entry: 'lib/api/resetLeaderboard.ts',
        handler: 'handler',
        environment: {
          ...props.databaseEnvironmentVariables,
        },
      }
    )

    this.resetLeaderboardLambdaIntegration =
      new aws_apigateway.LambdaIntegration(resetLeaderboardLambda)

    // DynamoDB Table

    const dynamoDBTable = new aws_dynamodb.TableV2(
      this,
      `team11-${environment.environmentName}-dynamodb-table`,
      {
        partitionKey: {
          name: 'title',
          type: aws_dynamodb.AttributeType.STRING,
        },
        tableName: environment.dynamodbTableName,
        removalPolicy: RemovalPolicy.DESTROY,
      }
    )

    dynamoDBTable.grantReadData(readLambda)
    dynamoDBTable.grantReadData(getAllLambda)
    dynamoDBTable.grantWriteData(writeLambda)
    dynamoDBTable.grantFullAccess(writeLambda)
    dynamoDBTable.grantFullAccess(deleteLambda)
  }
}
