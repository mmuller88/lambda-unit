import * as AWS from '../__mocks__/aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-require-imports
// const handler = require('../src/create-one');
import { handler } from '../src/get-one';

const db = new AWS.DynamoDB();

describe('run all', () => {
  test('get ddb entry', async () => {
    const result = await handler({ pathParameters: { id: '2' } });
    AWS.getItemResponse.mockReturnValueOnce({ Item: { title: 'A' } });
    expect(db.getItem).toHaveBeenCalled();
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify({ title: 'A' }) });
  });

  test('failed with missing parameter ', async () => {
    const result = await handler({ pathParameters: {} });
    expect(result).toEqual({ statusCode: 400, body: 'Error: You are missing the path parameter id' });
  });
});
