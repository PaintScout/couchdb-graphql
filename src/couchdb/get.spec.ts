import { get } from './get'
import { CouchDbContext, createContext } from '../createContext'
import fetchMock from 'fetch-mock'

describe('get', () => {
  let context: CouchDbContext

  beforeEach(() => {
    fetchMock.mock()
    context = createContext({
      dbName: 'test',
      dbUrl: 'my-url',
    })
  })

  afterEach(() => {
    fetchMock.restore()
    jest.clearAllMocks()
  })

  it('should get a doc', async () => {
    fetchMock.get(`${context.couchDb.dbUrl}/${context.couchDb.dbName}/1`, {
      status: 200,
      body: JSON.stringify({ _id: '1', _rev: '1', blah: 'blah' }),
    })

    const result = await get(context, '1')

    expect(result).toMatchObject({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })
  })

  it('should get a doc with extra options', async () => {
    fetchMock.get(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/1?revs=true&conflicts=true`,
      {
        status: 200,
        body: JSON.stringify({ _id: '1', _rev: '1', blah: 'blah' }),
      }
    )

    const result = await get(context, '1', { revs: true, conflicts: true })

    expect(result).toMatchObject({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })
  })
})
