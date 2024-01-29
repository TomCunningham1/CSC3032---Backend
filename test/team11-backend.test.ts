import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as Team11Backend from '../lib/team11-backend-stack';
import * as AWS from 'aws-sdk';

// example test. To run these tests, uncomment this file along with the
// example resource in lib/team11-backend-stack.ts

const cloudFormation = new AWS.CloudFormation();

AWS.config.update({ region: 'eu-west-1' });

cloudFormation.config.update({ region: 'eu-west-1'})

async function getStackResources(stackName: string) {
  const params = {
    StackName: stackName,
  };

  const response = await cloudFormation.describeStackResources(params).promise();
  return response.StackResources;
}

describe('CDK Stack Tests', () => {

  let template:Template;

  test('SQS Queue Created', () => {

    const app = new cdk.App();
    // WHEN
    const stack = new Team11Backend.Team11BackendStack(app, 'MyTestStack', {
      env: {
        account: '394261647652',
        region: 'eu-west-1',
      }
    });
    // THEN
    const template = Template.fromStack(stack); 

    template.hasResourceProperties('AWS::Lambda::Function', {});
  });

  test('Get Stack Resource', async () => {
    const x = await getStackResources('team11-non-production-backend-stack');

    console.log(x);
  })
})
