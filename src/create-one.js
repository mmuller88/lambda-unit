const AWS = require('aws-sdk');
const db = new AWS.DynamoDB();
// const { v4: uuidv4 } = require('uuid');
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

const RESERVED_RESPONSE = 'Error: You\'re using AWS reserved keywords as attributes',
  DYNAMODB_EXECUTION_ERROR = 'Error: Execution update, caused a Dynamodb error, please take a look at your CloudWatch Logs.';

exports.handler = async (event) => {

  if (!event.body) {
    return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
  }
  const item = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
  item[PRIMARY_KEY] = Date.now().toString();
  const params = {
    TableName: TABLE_NAME,
    Item: item,
  };

  try {
    await db.putItem(params).promise();
    return { statusCode: 201, body: '' };
  } catch (dbError) {
    const errorResponse = dbError.code === 'ValidationException' && dbError.message.includes('reserved keyword') ?
      DYNAMODB_EXECUTION_ERROR : RESERVED_RESPONSE;
    return { statusCode: 500, body: errorResponse };
  }
};