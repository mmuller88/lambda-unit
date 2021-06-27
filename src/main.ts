
import * as cdk from '@aws-cdk/core';
import { ApiStack } from './api-stack';
import { PipeStack } from './pipe-stack';

const app = new cdk.App();

const devEnv = {
  account: '981237193288',
  region: 'eu-central-1',
};

const apiStackName = 'api-stack-2-dev';
new ApiStack(app, apiStackName, { env: devEnv });
new PipeStack(app, 'pipe-stack', { env: devEnv, devStackName: apiStackName });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();