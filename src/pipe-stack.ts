import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
// import { GitHubSourceAction } from '@aws-cdk/aws-codepipeline-actions';
// import * as pipelines from '@aws-cdk/pipelines';
// import { CdkpipelinesDemoStage } from './CdkpipelinesDemoStage';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
// import { CdkpipelinesDemoStage } from './CdkpipelinesDemoStage';


export class PipeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);


    const pipeline = new codepipeline.Pipeline(this, 'BuildPipeline', {
      artifactBucket: new s3.Bucket(this, 'pipebbucket', {
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        autoDeleteObjects: true,
      }),
    });

    new codebuild.ReportGroup(this, 'reportGroup', { reportGroupName: 'testReportGroup', removalPolicy: cdk.RemovalPolicy.DESTROY });

    const cdkBuild = new codebuild.PipelineProject(this, 'CdkBuild', {
      // encryptionKey: pipeline.artifactBucket.encryptionKey,
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            'runtime-versions': { nodejs: 12 },
            'commands': ['npm i npm@latest -g', 'npm install'],
          },
          build: {
            commands: ['npm run build', 'npm run synth', 'npm run test'],
          },
        },
        reports: {
          testReportGroup: {
            'files': ['**/*'],
            'base-directory': 'test-reports',
            'discard-paths': 'no',
          },
        },
        artifacts: {
          files: [
            'cdk.out/**/*',
          ],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_3_0,
      },
    });

    const sourceOutput = new codepipeline.Artifact();
    const cdkBuildOutput = new codepipeline.Artifact('CdkBuildOutput');
    // cdkBuildOutput.

    // const deployProdProject = new codebuild.PipelineProject(this, 'updateStackProd', createUpdateStackSpec(props.prodStack.stackName));
    // deployProdProject.addToRolePolicy(new iam.PolicyStatement({
    //   actions: ['*'], // cloudformation:DescribeStacks, ssm:GetParameter
    //   resources: ['*'],
    // }));

    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.GitHubSourceAction({
          owner: 'mmuller88',
          repo: 'lambda-unit',
          branch: 'main',
          output: sourceOutput,
          actionName: 'GitHubSource',
          oauthToken: cdk.SecretValue.secretsManager('alfcdk', {
            jsonField: 'muller88-github-token',
          }),
          trigger: codepipeline_actions.GitHubTrigger.WEBHOOK,
        }),
      ],
    });

    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'CDK_Build',
          project: cdkBuild,
          input: sourceOutput,
          outputs: [cdkBuildOutput],
        }),
      ],
    });

    const createAction = new codepipeline_actions.CloudFormationCreateUpdateStackAction({
      actionName: 'deployDev',
      stackName: 'api-stack-dev',
      templatePath: cdkBuildOutput.atPath('cdk.out/api-stack-dev.template.json'),
      adminPermissions: true,
      region: 'eu-central-1',
    });

    pipeline.addStage({
      stageName: 'Dev',
      actions: [
        createAction,
      ],
    });

    createAction.addToDeploymentRolePolicy(new iam.PolicyStatement({
      actions: ['*'], // cloudformation:DescribeStacks, ssm:GetParameter
      resources: ['*'],
    }));

    // const oauth = cdk.SecretValue.secretsManager('alfcdk', {
    //   jsonField: 'muller88-github-token',
    // });

    // const sourceArtifact = new codepipeline.Artifact();

    // const repo = new GitHubSourceAction({
    //   actionName: 'GithubSource',
    //   branch: 'main',
    //   owner: 'mmuller88',
    //   repo: 'lambda-unit',
    //   oauthToken: oauth,
    //   output: sourceArtifact,
    // });

    // const cloudAssemblyArtifact = new codepipeline.Artifact();

    // const pipeline = new pipelines.CdkPipeline(this, 'pipe', {
    //   cloudAssemblyArtifact,
    //   // Where the source can be found
    //   sourceAction: repo,
    //   // How it will be built and synthesized
    //   synthAction: new pipelines.SimpleSynthAction({
    //     sourceArtifact,
    //     cloudAssemblyArtifact,
    //     installCommand: 'yarn install --frozen-lockfile',
    //     buildCommand: 'yarn build',
    //     testCommands: ['yarn test'],
    //     synthCommand: 'npx cdk synth',
    //     // testReports: [{
    //     //   name: "GroupName" | "GroupArn",
    //     //   reportType: "Test" | "CodeCoverage",
    //     //   files: string[],
    //     //   fileFormat: "JUNITXML" | "OTHER_TYPES" | etc...,
    //     //   baseDirectory: string,
    //     // }]
    //   }),
    // });

    // // console.log(pipeline.node.findAll());

    // // pipeline.node.findAll().map(child => {
    // //   console.log(child.node.id);
    // // });

    // new codebuild.ReportGroup(this, 'reportGroup', { reportGroupName: 'testReportGroup', removalPolicy: cdk.RemovalPolicy.DESTROY });

    // const cfnBuildProject = pipeline.node.findAll().filter(child => child.node.id === 'CdkBuildProject')[0].node.defaultChild as codebuild.CfnProject;
    // cfnBuildProject.source = {
    //   ...cfnBuildProject.source,
    //   buildSpec: JSON.stringify({
    //     version: '0.2',
    //     phases: {
    //       pre_build: {
    //         commands: ['yarn install --frozen-lockfile'],
    //       },
    //       build: {
    //         commands: ['yarn build', 'yarn test', 'npx cdk synth'],
    //       },
    //     },
    //     reports: {
    //       testReportGroup: {
    //         'files': ['**/*'],
    //         'base-directory': 'test-reports',
    //         'discard-paths': 'no',
    //       },
    //     },
    //     artifacts: { 'base-directory': 'cdk.out', 'files': '**/*' },
    //   }),

    // };

    // // "BuildSpec": "{\n  \"version\": \"0.2\",\n  \"phases\": {\n    \"pre_build\": {\n      \"commands\": [\n        \"yarn install --frozen-lockfile\"\n      ]\n    },\n    \"build\": {\n      \"commands\": [\n        \"yarn build\",\n        \"yarn test\",\n        \"npx cdk synth\"\n      ]\n    }\n  },\n  \"artifacts\": {\n    \"base-directory\": \"cdk.out\",\n    \"files\": \"**/*\"\n  }\n}",


    // // console.log(cfnBuildProject);

    // pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'devStage', {
    //   env: {
    //     account: '981237193288',
    //     region: 'eu-central-1',
    //   },
    // }));

  }
}