import { Construct, Stage, StageProps } from '@aws-cdk/core';
import { ApiStack } from './api-stack';

/**
 * Deployable unit of web service app
 */
export class CdkpipelinesDemoStage extends Stage {
  // public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);

    new ApiStack(this, 'ApiStack');

    // Expose CdkpipelinesDemoStack's output one level higher
    // this.urlOutput = apiStack.
  }
}