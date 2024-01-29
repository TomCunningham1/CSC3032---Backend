import { Capture, Match, Template } from 'aws-cdk-lib/assertions';
import { App } from 'aws-cdk-lib'
import { Team11BackendStack } from '../lib/team11-backend-stack';


describe('CDK Stack Tests', () => {

  let backendStackTemplate: Template;

  beforeAll(() => {

    const testApp = new App({
      outdir: 'cdk.out'
    })

    const backendStack = new Team11BackendStack(testApp, 'team11-non-production-back-end-stack',
    {
      env: {
        region: 'eu-west-1',
        account: '394261647652'
      }
    });

    backendStackTemplate = Template.fromStack(backendStack);
  })

  it('should validate lambda properties', () => {

    backendStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
      Handler: 'index.handler',
      Runtime: 'nodejs18.x'
    });

    expect(true).toBeTruthy();
  })

  it('should check total number of lambdas', () => {
    const lambdaActionsCapture = new Capture();

    backendStackTemplate.hasResourceProperties('AWS::Lambda::Function', {
      FunctionName: lambdaActionsCapture
    })

    expect(lambdaActionsCapture._captured.length).toBe(4);
  })

  it('lambda should match expected output', () => {
    const lambda = backendStackTemplate.findResources('AWS::Lambda::Resources');
    expect(lambda).toMatchSnapshot()
  })

  it('stack snapshot should match expected output', () => {
    expect(backendStackTemplate.toJSON()).toMatchSnapshot()
  })
})

