import { resolveConflicts } from './resolveConflicts'
import fetchMock from 'fetch-mock'
import { createContext } from '../createContext'

const dbUrl = 'my-url'
const dbName = 'my-db'

describe('resolveConflicts', () => {
  beforeEach(() => {
    fetchMock.mock()
  })

  afterEach(() => {
    fetchMock.restore()
  })

  it('should call context.onResolveConflict', async () => {
    const savingDocument = {
      _id: '123',
      _rev: '3',
      resolved: true,
    }

    const storedDocument = {
      _id: '123',
      _rev: '3',
      resolved: false,
      _conflicts: ['3-a'],
    }

    const conflictingDocument = {
      _id: '123',
      resolved: 123,
      _rev: '3-a',
    }

    fetchMock
      .post(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`, {
        status: 200,
        body: JSON.stringify({
          rows: [
            {
              doc: storedDocument,
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_get`, {
        status: 200,
        body: JSON.stringify({
          results: [
            {
              docs: [
                {
                  ok: conflictingDocument,
                },
              ],
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_docs`, {
        status: 200,
        body: JSON.stringify('good'),
      })

    const onResolveConflict = jest.fn(() => savingDocument as any)
    const context = createContext({
      dbUrl,
      dbName,
      onResolveConflict,
    })

    await resolveConflicts([savingDocument], context)

    expect(onResolveConflict).toHaveBeenCalledWith({
      document: savingDocument,
      conflicts: [storedDocument, conflictingDocument],
      context,
    })
  })

  it('should call context.onConflictsResolved', async () => {
    const savingDocument = {
      _id: '123',
      _rev: '3',
      resolved: true,
    }

    const storedDocument = {
      _id: '123',
      _rev: '3',
      resolved: false,
      _conflicts: ['3-a'],
    }

    const conflictingDocument = {
      _id: '123',
      resolved: 123,
      _rev: '3-a',
    }

    const resolvedDocument = { _id: '123', _rev: '3', blah: true }

    fetchMock
      .post(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`, {
        status: 200,
        body: JSON.stringify({
          rows: [
            {
              doc: storedDocument,
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_get`, {
        status: 200,
        body: JSON.stringify({
          results: [
            {
              docs: [
                {
                  ok: conflictingDocument,
                },
              ],
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_docs`, {
        status: 200,
        body: JSON.stringify([
          {
            id: '123',
            rev: '3',
            ok: true,
          },
        ]),
      })

    const onConflictsResolved = jest.fn()
    const context = createContext({
      dbUrl,
      dbName,
      onResolveConflict: () => resolvedDocument as any,
      onConflictsResolved,
    })

    await resolveConflicts([savingDocument], context)

    expect(onConflictsResolved).toHaveBeenCalledWith({
      documents: [resolvedDocument],
      context,
    })
  })

  it('should resolve a conflict caused by mismatched rev', async () => {
    const savingDocument = {
      _id: '123',
      _rev: '2',
      resolved: false,
    }

    const storedDocument = {
      ...savingDocument,
      _rev: '3',
    }

    const resolvedDocument = {
      ...savingDocument,
      ...storedDocument,
      resolved: true,
    }

    fetchMock
      .post(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`, {
        status: 200,
        body: JSON.stringify({
          rows: [
            {
              doc: storedDocument,
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_get`, {
        status: 200,
        body: JSON.stringify({
          results: [
            {
              docs: [
                {
                  ok: storedDocument,
                },
              ],
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_docs`, {
        status: 200,
        body: JSON.stringify('good'),
      })

    const result = await resolveConflicts(
      [savingDocument],
      createContext({
        dbUrl,
        dbName,
        onResolveConflict: () => {
          return resolvedDocument as any
        },
      })
    )

    // expect _bulk_docs to have been called with resolved document
    expect(fetchMock.calls()).toHaveLength(3)

    const bulkGetPost = fetchMock.calls(/_bulk_docs/)[0]
    expect(bulkGetPost[1]).toEqual({
      headers: expect.anything(),
      method: 'POST',
      body: JSON.stringify({ docs: [resolvedDocument] }),
    })
    expect(result).toEqual('good')
  })

  it('should resolve a conflict for a document with _conflicts', async () => {
    const savingDocument = {
      _id: '123',
      _rev: '3',
      resolved: true,
    }

    const storedDocument = {
      _id: '123',
      _rev: '3',
      resolved: false,
      _conflicts: ['3-a'],
    }

    const conflictingDocument = {
      _id: '123',
      resolved: 123,
      _rev: '3-a',
    }

    const resolvedDocument = {
      ...savingDocument,
    }

    fetchMock
      .post(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`, {
        status: 200,
        body: JSON.stringify({
          rows: [
            {
              doc: storedDocument,
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_get`, {
        status: 200,
        body: JSON.stringify({
          results: [
            {
              docs: [
                {
                  ok: conflictingDocument,
                },
              ],
            },
          ],
        }),
      })
      .post(`${dbUrl}/${dbName}/_bulk_docs`, {
        status: 200,
        body: JSON.stringify('good'),
      })

    const result = await resolveConflicts(
      [savingDocument],
      createContext({
        dbUrl,
        dbName,
        onResolveConflict: () => {
          return resolvedDocument as any
        },
      })
    )

    // expect _bulk_docs to have been called with resolved document and deleted conflict
    expect(fetchMock.calls()).toHaveLength(3)

    const bulkDocsCall = fetchMock.calls(/_bulk_docs/)[0]
    expect(bulkDocsCall[1]).toEqual({
      headers: expect.anything(),
      method: 'POST',

      body: JSON.stringify({
        docs: [
          resolvedDocument,
          {
            ...conflictingDocument,
            _deleted: true,
          },
        ],
      }),
    })
    expect(result).toEqual('good')
  })
})
