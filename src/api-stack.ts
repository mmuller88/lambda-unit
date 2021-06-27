import * as apigateway from '@aws-cdk/aws-apigateway';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambdajs from '@aws-cdk/aws-lambda-nodejs';
import * as cdk from '@aws-cdk/core';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');


export class ApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    const dynamoTable = new ddb.Table(this, 'items', {
      partitionKey: {
        name: 'itemId',
        type: ddb.AttributeType.STRING,
      },
      tableName: 'itemss',

      // The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
      // the new table, and it will remain in your account until manually deleted. By setting the policy to
      // DESTROY, cdk destroy will delete the table (even if it has data in it)
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const createOne = new lambdajs.NodejsFunction(this, 'createOne', {
      entry: `${path.join(__dirname)}/create-one.js`,
    });

    const getOne = new lambdajs.NodejsFunction(this, 'getOne', {
      entry: `${path.join(__dirname)}/get-one.js`,
    });

    dynamoTable.grantReadWriteData(getOne);
    dynamoTable.grantReadWriteData(createOne);

    const api = new apigateway.RestApi(this, 'itemsApi', {
      restApiName: 'Items Service',
    });

    const items = api.root.addResource('items');

    const createOneIntegration = new apigateway.LambdaIntegration(createOne);
    items.addMethod('POST', createOneIntegration);

    const singleItem = items.addResource('{id}');
    const getOneIntegration = new apigateway.LambdaIntegration(getOne);
    singleItem.addMethod('GET', getOneIntegration);
  }
}