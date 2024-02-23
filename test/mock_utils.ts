// DynamoDB Mock

const promiseMock = jest.fn()
const functionMock = jest.fn()

functionMock.mockReturnValue({
    promise: promiseMock.mockResolvedValue({
        ConsumedCapacity: 'Test Capacity'
    })
})

const mockDynamoDB = jest.fn()


mockDynamoDB.mockReturnValue(
    {
        putItem: functionMock,
        getItem: functionMock,
        deleteItem: functionMock,
        scan: functionMock
    });

const dynamoDBMock = {
    mockDynamoDB,
    promiseMock,
    functionMock
}

// Relational Database Mock

const queryMock = jest.fn()
const connMock = jest.fn()
const rdsPromiseMock = jest.fn()
const mockDB = jest.fn()
const releaseMock = jest.fn()
const endMock = jest.fn()

mockDB.mockReturnValue({
    promise: rdsPromiseMock
})

rdsPromiseMock.mockReturnValue({
    getConnection: connMock,
    end: endMock
})

connMock.mockResolvedValue({
    query: queryMock,
    release: releaseMock
})

const rdsMock = {
    queryMock,
    connMock,
    mockPromise: rdsPromiseMock,
    mockDB,
    releaseMock
}

export {
    rdsMock,
    dynamoDBMock
}