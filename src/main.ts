
import * as cdk from '@aws-cdk/core';
import { ApiStack } from './api-stack';
import { PipeStack } from './pipe-stack';

const app = new cdk.App();

const devEnv = {
  account: '981237193288',
  region: 'eu-central-1',
};

new PipeStack(app, 'pipe-stack', { env: devEnv });
new ApiStack(app, 'api-stack-2-dev', { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();