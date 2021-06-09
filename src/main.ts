import * as codepipeline from '@aws-cdk/aws-codepipeline';
import { GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions';
import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines';
import { ApiStack } from './api-stack';
import { CdkpipelinesDemoStage } from './CdkpipelinesDemoStage';

// for development, use account/region from cdk cli
const devEnv = {
  account: '981237193288',
  region: 'eu-central-1',
};

const app = new cdk.App();

const oauth = cdk.SecretValue.secretsManager('alfcdk', {
  jsonField: 'muller88-github-token',
});

const sourceArtifact = new codepipeline.Artifact();

const repo = new GitHubSourceAction({
  actionName: 'GithubSource',
  branch: 'main',
  owner: 'mmuller88',
  repo: 'lambda-unit',
  oauthToken: oauth,
  output: sourceArtifact,
});

const cloudAssemblyArtifact = new codepipeline.Artifact();

const pipeline = new pipelines.CdkPipeline(app, 'pipe', {
  cloudAssemblyArtifact,
  // Where the source can be found
  sourceAction: repo,
  // How it will be built and synthesized
  synthAction: new pipelines.SimpleSynthAction({
    sourceArtifact,
    cloudAssemblyArtifact,
    installCommand: 'yarn install --frozen-lockfile',
    buildCommand: 'yarn build',
    testCommands: ['yarn test'],
    synthCommand: 'npx cdk synth',
    // testReports: [{
    //   name: "GroupName" | "GroupArn",
    //   reportType: "Test" | "CodeCoverage",
    //   files: string[],
    //   fileFormat: "JUNITXML" | "OTHER_TYPES" | etc...,
    //   baseDirectory: string,
    // }]
  }),
});

pipeline.addApplicationStage(new CdkpipelinesDemoStage(app, 'devStage', {
  env: {
    account: '981237193288',
    region: 'eu-central-1',
  },
}));

// new ApiStack(app, 'api-stack-dev', { env: devEnv });
// new MyStack(app, 'my-stack-prod', { env: prodEnv });

app.synth();