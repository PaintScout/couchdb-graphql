import MockAdapter from 'axios-mock-adapter'
import getAxios from '../util/getAxios'
import { gql } from 'apollo-server-core'

import { resolveConflicts } from '../util/resolveConflicts'
import asJestMock from '../test/util/asJestMock'
import { CouchDbContext } from '../util/createResolver'
import { bulkDocs } from './bulkDocs'

jest.mock('../util/getAxios')
jest.mock('../util/resolveConflicts')

const mockAxios = new MockAdapter(getAxios(null))

const context: CouchDbContext = {
  dbName: 'test',
  dbUrl: 'http://my-url/',
}

describe('bulkDocs', () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockAxios.resetHistory()
  })

  it('should create docs', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          rev: '1',
        },
        {
          id: '2',
          rev: '1',
        },
      ])

    const result = await bulkDocs(context, [
      {
        _id: '1',
        blah: 'blah',
      },
      {
        _id: '2',
        blah2: 'blah2',
      },
    ])

    expect(result).toMatchObject([
      {
        _id: '1',
        _rev: '1',
        document: {
          _id: '1',
          _rev: '1',
          blah: 'blah',
        },
      },
      {
        _id: '2',
        _rev: '1',
        document: {
          _id: '2',
          _rev: '1',
          blah2: 'blah2',
        },
      },
    ])
  })

  it('should update docs', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          rev: '2',
        },
        {
          id: '2',
          rev: '2',
        },
      ])

    const result = await bulkDocs(context, [
      {
        _id: '1',
        _rev: '1',
        blah: 'blah',
      },
      {
        _id: '2',
        _rev: '1',
        blah2: 'blah2',
      },
    ])

    expect(result).toMatchObject([
      {
        _id: '1',
        _rev: '2',
        document: {
          _id: '1',
          _rev: '2',
          blah: 'blah',
        },
      },
      {
        _id: '2',
        _rev: '2',
        document: {
          _id: '2',
          _rev: '2',
          blah2: 'blah2',
        },
      },
    ])
  })

  it('should upsert docs', async () => {
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
          {
            id: '2',
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
        {
          id: '2',
          rev: '2',
        },
      ])

    const result = await bulkDocs(context, [
      {
        _id: '1',
        blah: 'blah',
      },
      {
        _id: '2',
        blah2: 'blah2',
      },
    ])

    expect(result).toMatchObject([
      {
        _id: '1',
        _rev: '2',
        document: {
          _id: '1',
          _rev: '2',
          blah: 'blah',
        },
      },
      {
        _id: '2',
        _rev: '2',
        document: {
          _id: '2',
          _rev: '2',
          blah2: 'blah2',
        },
      },
    ])
  })

  it('should have errors for failed docs', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          error: 'oops',
          reason: 'idk',
        },
        {
          id: '2',
          rev: '2',
        },
      ])

    const result = await bulkDocs(context, [
      {
        _id: '1',
        _rev: '1',
        blah: 'blah',
      },
      {
        _id: '2',
        _rev: '1',
        blah2: 'blah2',
      },
    ])

    expect(result).toMatchObject([
      {
        _id: '1',
        _rev: '1',
        error: 'oops',
        reason: 'idk',
        document: {
          _id: '1',
          _rev: '1',
          blah: 'blah',
        },
      },
      {
        _id: '2',
        _rev: '2',
        document: {
          _id: '2',
          _rev: '2',
          blah2: 'blah2',
        },
      },
    ])
  })

  it('should call resolveConflicts for conflicting docs', async () => {
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

    const result = await bulkDocs(context, [
      {
        _id: '1',
        _rev: '1',
        blah: 'blah',
      },
    ])

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

    expect(result).toMatchObject([
      {
        _id: '1',
        _rev: '3',
        document: {
          _id: '1',
          _rev: '3',
          blah: 'blah',
        },
      },
    ])
  })

  it('should call context.onDocumentsSaved with result', async () => {
    mockAxios
      .onPost(`${context.dbUrl}/${context.dbName}/_bulk_docs`)
      .reply(200, [
        {
          id: '1',
          rev: '1',
        },
        {
          id: '2',
          rev: '1',
        },
      ])

    const onDocumentsSaved = jest.fn()

    await bulkDocs({ ...context, onDocumentsSaved }, [
      {
        _id: '1',
        blah: 'blah',
      },
      {
        _id: '2',
        blah2: 'blah2',
      },
    ])
    expect(onDocumentsSaved).toHaveBeenCalledWith({
      documents: [
        {
          _id: '1',
          _rev: '1',
          blah: 'blah',
        },
        {
          _id: '2',
          _rev: '1',
          blah2: 'blah2',
        },
      ],
      context: { ...context, onDocumentsSaved },
    })
  })
})
