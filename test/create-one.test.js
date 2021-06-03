const AWS = require('../__mocks__/aws-sdk');
const handler = require('../src/create-one').handler;
// import { handler } from '../src/create-one';

const db = new AWS.DynamoDB();

describe('run all', () => {
  test('create ddb entry', async () => {
    const result = await handler({ body: { title: 'A' } });
    expect(db.putItem).toHaveBeenCalled();
    expect(result).toEqual({ statusCode: 201, body: '' });
  });

  test('failed with missing body', async () => {
    const result = await handler({});
    expect(result).toEqual({ statusCode: 400, body: 'invalid request, you are missing the parameter body' });
  });
});
