import * as AWS from '../__mocks__/aws-sdk';
// eslint-disable-next-line @typescript-eslint/no-require-imports
// const handler = require('../src/create-one');
import { handler } from '../src/create-one';

const db = new AWS.DynamoDB();

describe('run all', () => {
  test('create ddb entry', async () => {
    const result = await handler({ body: { title: 'A' } });
    expect(db.putItem).toHaveBeenCalled();
    expect(result).toEqual({ statusCode: 201, body: '' });
  });

  test('failed with missing body', async () => {
    const result = await handler();
    expect(result).toEqual({ statusCode: 400, body: 'invalid request, you are missing the parameter body' });
  });
});
