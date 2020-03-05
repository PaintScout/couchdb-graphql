import fetchMock from 'fetch-mock'
import { resolveConflicts } from '../util/resolveConflicts'
import asJestMock from '../test/util/asJestMock'
import { put } from './put'
import { createContext, CouchDbContext } from '../createContext'

jest.mock('../util/resolveConflicts')

describe('put', () => {
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

  it('should create a document', async () => {
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            rev: '1',
          },
        ]),
      }
    )

    const result = await put(context, {
      _id: '1',
      blah: 'blah',
    })

    expect(result).toMatchObject({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })
  })

  it('should upsert a document', async () => {
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
        ]),
      })

    const result = await put(context, {
      _id: '1',
      blah: 'blah',
    })

    expect(result).toMatchObject({
      _id: '1',
      _rev: '2',
      blah: 'blah',
    })
  })

  it('should call resolveConflicts for conflict', async () => {
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

    const result = await put(context, {
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })
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
        ]),
      }
    )

    const onDocumentsSaved = jest.fn()

    await put(
      { couchDb: { ...context.couchDb, onDocumentsSaved } },
      {
        _id: '1',
        blah: 'blah',
      }
    )

    expect(onDocumentsSaved).toHaveBeenCalledWith({
      documents: [
        {
          _id: '1',
          _rev: '1',
          blah: 'blah',
        },
      ],
      context: { couchDb: { ...context.couchDb, onDocumentsSaved } },
    })
  })

  it('should remove null _deleted', async () => {
    fetchMock.post(
      `${context.couchDb.dbUrl}/${context.couchDb.dbName}/_bulk_docs`,
      {
        status: 200,
        body: JSON.stringify([
          {
            id: '1',
            rev: '1',
          },
        ]),
      }
    )

    await put(context, {
      _id: '1',
      blah: 'blah',
      _deleted: null,
    })

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
