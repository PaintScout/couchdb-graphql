import { resolveConflicts } from '../util/resolveConflicts'
import asJestMock from '../test/util/asJestMock'
import { bulkDocs } from './bulkDocs'
import { CouchDbContext, createContext } from '../createContext'
import fetchMock from 'fetch-mock'

jest.mock('../util/resolveConflicts')

describe('bulkDocs', () => {
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

  it('should create docs', async () => {
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            rev: '1',
          },
          {
            id: '2',
            rev: '1',
          },
        ]),
      }
    )

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
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            rev: '2',
          },
          {
            id: '2',
            rev: '2',
          },
        ]),
      }
    )

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
    fetchMock
      .post(`${context.couchDb.dbUrl}/${context.couchDb.dbName}/_all_docs`, {
        status: 200,
        body: JSON.stringify({
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
        }),
      })
      .post(`${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`, {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            rev: '2',
          },
          {
            id: '2',
            rev: '2',
          },
        ]),
      })

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
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            error: 'oops',
            reason: 'idk',
          },
          {
            id: '2',
            rev: '2',
          },
        ]),
      }
    )

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
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            rev: '2',
            error: 'conflict',
          },
        ]),
      }
    )

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

  it('should call context.couchDb.onDocumentsSaved with result', async () => {
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            rev: '1',
          },
          {
            id: '2',
            rev: '1',
          },
        ]),
      }
    )

    const onDocumentsSaved = jest.fn()

    await bulkDocs({ couchDb: { ...context.couchDb, onDocumentsSaved } }, [
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
      context: { couchDb: { ...context.couchDb, onDocumentsSaved } },
    })
  })

  it('should remove null _deleted from docs', async () => {
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            blah: 'blah',
          },
        ]),
      }
    )

    const result = await bulkDocs(context, [
      {
        _id: '1',
        blah: 'blah',
        _deleted: null,
      },
    ])

    const fetchCall = fetchMock.calls(/_bulk_docs/)[0][1]

    expect(fetchCall).toEqual({
      headers: expect.anything(),
      method: 'POST',

      body: JSON.stringify({
        docs: [
          {
            _id: '1',
            blah: 'blah',
          },
        ],
        new_edits: true,
      }),
    })
  })
})
