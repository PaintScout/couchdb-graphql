import MockAdapter from 'axios-mock-adapter'
import getAxios from '../util/getAxios'
import { gql } from 'apollo-server-core'
import { resolveConflicts } from '../util/resolveConflicts'
import asJestMock from '../test/util/asJestMock'
import { CouchDbContext } from '../util/createResolver'
import { put } from './put'

jest.mock('../util/getAxios')
jest.mock('../util/resolveConflicts')

const mockAxios = new MockAdapter(getAxios(null))

const context: CouchDbContext = {
  dbName: 'test',
  dbUrl: 'http://my-url/',
}

describe('put', () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockAxios.resetHistory()
  })

  it('should create a document', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          rev: '1',
        },
      ])

    const result = await put(
      {
        _id: '1',
        blah: 'blah',
      },
      context
    )

    expect(result).toMatchObject({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })
  })

  it('should upsert a document', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_all_docs`)
      .reply(200, {
        rows: [
          {
            id: '1',
            value: {
              rev: '1',
            },
          },
        ],
      })
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          rev: '2',
        },
      ])

    const result = await put(
      {
        _id: '1',
        blah: 'blah',
      },
      context
    )

    expect(result).toMatchObject({
      _id: '1',
      _rev: '2',
      blah: 'blah',
    })
  })

  it('should call resolveConflicts for conflict', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          rev: '2',
          error: 'conflict',
        },
      ])

    asJestMock(resolveConflicts).mockResolvedValue([
      {
        id: '1',
        rev: '3',
        ok: true,
      },
    ])

    const result = await put(
      {
        _id: '1',
        _rev: '1',
        blah: 'blah',
      },
      context
    )
    expect(resolveConflicts).toHaveBeenCalledWith(
      [
        {
          _id: '1',
          _rev: '1',
          blah: 'blah',
        },
      ],
      expect.anything() // context object
    )

    expect(result).toMatchObject({
      _id: '1',
      _rev: '3',
      blah: 'blah',
    })
  })

  it('should call context.onDocumentsSaved with result', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          rev: '1',
        },
      ])

    const onDocumentsSaved = jest.fn()

    const result = await put(
      {
        _id: '1',
        blah: 'blah',
      },
      { ...context, onDocumentsSaved }
    )

    expect(onDocumentsSaved).toHaveBeenCalledWith([
      {
        _id: '1',
        _rev: '1',
        blah: 'blah',
      },
    ])
  })
})
