const AWS = require('../__mocks__/aws-sdk');
const handler = require('../src/get-one').handler;

const db = new AWS.DynamoDB();

describe('run all', () => {
  test('get ddb entry', async () => {
    AWS.getItemResponse.mockReturnValueOnce({ Item: { title: 'A' } });
    const result = await handler({ pathParameters: { id: '2' } });
    expect(db.getItem).toHaveBeenCalled();
    expect(result).toEqual({ statusCode: 200, body: JSON.stringify({ title: 'A' }) });
  });

  test('failed with missing parameter ', async () => {
    const result = await handler({ pathParameters: {} });
    expect(result).toEqual({ statusCode: 400, body: 'Error: You are missing the path parameter id' });
  });
});
