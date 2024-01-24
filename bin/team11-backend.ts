#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { Team11BackendStack } from '../lib/team11-backend-stack'
import environment from '../lib/config/environment';

const app = new cdk.App()
new Team11BackendStack(app, `team11-${environment.environmentName}-backend-stack`, {
  env: {
    account: '394261647652',
    region: 'eu-west-1',
  },
})
