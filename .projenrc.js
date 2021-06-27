const { AwsCdkTypeScriptApp, NodePackageManager } = require('projen');

const deps = ['@types/aws-lambda', 'aws-lambda', 'aws-sdk', 'esbuild@^0'];

const project = new AwsCdkTypeScriptApp({
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'martin.mueller',
  cdkVersion: '1.110.0',
  defaultReleaseBranch: 'main',
  name: 'lambda-unit',
  packageManager: NodePackageManager.NPM,
  cdkDependencies: [
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-nodejs',
    '@aws-cdk/aws-iam',
    '@aws-cdk/aws-s3',
    '@aws-cdk/pipelines',
    '@aws-cdk/aws-codepipeline',
    '@aws-cdk/aws-codebuild',
    '@aws-cdk/aws-codepipeline-actions',
  ],
  context: {
    '@aws-cdk/core:enableStackNameDuplicates': true,
    'aws-cdk:enableDiffNoFail': true,
    '@aws-cdk/core:stackRelativeExports': true,
    '@aws-cdk/core:newStyleStackSynthesis': true,
  },
  deps,
  cdkVersionPinning: true,
});

project.jest.addTestMatch('**/?(*.)+(spec|test).js?(x)');

project.setScript('cdkDeploy', 'cdk deploy');
project.setScript('cdkDestroy', 'cdk destroy');

project.synth();
