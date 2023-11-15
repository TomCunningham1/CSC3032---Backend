import { aws_lambda, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class Team11BackendStack extends Stack {
  constructor(scope: Construct, id: string, props?:  StackProps) {
    super(scope, id, props);

    new aws_lambda.Function(this, 'backend-health', {
      runtime: aws_lambda.Runtime.NODEJS_18_X,
      handler: 'health.handler',
      code: aws_lambda.Code.fromAsset('lib/api')
    })

  }
}
