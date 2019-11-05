import MockAdapter from 'axios-mock-adapter'
import getAxios from '../util/getAxios'
import { CouchDbContext } from '../util/createResolver'
import { get } from './get'

jest.mock('../util/getAxios')

const mockAxios = new MockAdapter(getAxios(null))

const context: CouchDbContext = {
  dbName: 'test',
  dbUrl: 'http://my-url/',
}

describe('get', () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockAxios.resetHistory()
  })

  it('should get a doc', async () => {
    mockAxios
      .onGet(`${context.dbUrl}/${context.dbName}/1`)
      .replyOnce(200, { _id: '1', _rev: '1', blah: 'blah' })

    const result = await get(context, '1')

    expect(result).toMatchObject({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })
  })

  it('should get a doc with extra options', async () => {
    mockAxios
      .onGet(`${context.dbUrl}/${context.dbName}/1?revs=true&conflicts=true`)
      .replyOnce(200, { _id: '1', _rev: '1', blah: 'blah' })

    const result = await get(context, '1', { revs: true, conflicts: true })

    expect(result).toMatchObject({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })
  })
})
