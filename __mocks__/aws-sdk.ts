export const getItemResponse = jest.fn().mockReturnValue(Promise.resolve(true));
const getItemFn = jest.fn().mockImplementation(() => ({ promise: getItemResponse }));
export const putItemResponse = jest.fn().mockReturnValue(Promise.resolve(true));
const putItemFn = jest.fn().mockImplementation(() => ({ promise: putItemResponse }));

export class DynamoDB {

  public getItem: jest.Mock<any, any>;
  public putItem: jest.Mock<any, any>;

  constructor() {
    this.getItem = getItemFn;
    this.putItem = putItemFn;
  }
}

