#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { QuickFitInfraStack } from '../lib/quickfit-infra-stack';

const app = new cdk.App();

new QuickFitInfraStack(app, 'QuickFitInfraStack', {
  env: {
    region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
    account: process.env.CDK_DEFAULT_ACCOUNT,
  },
});

app.synth();
