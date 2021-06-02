const { AwsCdkTypeScriptApp } = require('projen');

const deps = [
  '@types/aws-lambda',
  'aws-lambda',
  'aws-sdk',
  'esbuild@^0',
];

const project = new AwsCdkTypeScriptApp({
  authorAddress: 'damadden88@googlemail.com',
  authorName: 'martin.mueller',
  cdkVersion: '1.107.0',
  defaultReleaseBranch: 'main',
  name: 'lambda-unit',
  cdkDependencies: [
    '@aws-cdk/aws-dynamodb',
    '@aws-cdk/aws-apigateway',
    '@aws-cdk/aws-lambda',
    '@aws-cdk/aws-lambda-nodejs',
  ],
  deps,
  cdkVersionPinning: true,
});

project.setScript('cdkDeploy', 'cdk deploy');
project.setScript('cdkDestroy', 'cdk destroy');

project.synth();