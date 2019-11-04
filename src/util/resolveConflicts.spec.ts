import MockAdapter from 'axios-mock-adapter'
import getAxios from './getAxios'
import { resolveConflicts } from './resolveConflicts'
jest.mock('./getAxios')

const mockAxios = new MockAdapter(getAxios(null))

const dbUrl = 'my-url'
const dbName = 'my-db'

describe('resolveConflicts', () => {
  afterEach(() => {
    mockAxios.resetHistory()
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

    mockAxios
      .onPost(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`)
      .replyOnce(200, {
        rows: [
          {
            doc: storedDocument,
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_get`)
      .replyOnce(200, {
        results: [
          {
            docs: [
              {
                ok: conflictingDocument,
              },
            ],
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_docs`)
      .replyOnce(200, 'good')

    const onResolveConflict = jest.fn(() => savingDocument as any)
    const context = {
      dbUrl,
      dbName,
      onResolveConflict,
    }

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

    mockAxios
      .onPost(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`)
      .replyOnce(200, {
        rows: [
          {
            doc: storedDocument,
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_get`)
      .replyOnce(200, {
        results: [
          {
            docs: [
              {
                ok: conflictingDocument,
              },
            ],
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_docs`)
      .replyOnce(200, [
        {
          id: '123',
          rev: '3',
          ok: true,
        },
      ])

    const onConflictsResolved = jest.fn()
    await resolveConflicts([savingDocument], {
      dbUrl,
      dbName,
      onResolveConflict: () => resolvedDocument as any,
      onConflictsResolved,
    })

    expect(onConflictsResolved).toHaveBeenCalledWith([resolvedDocument])
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

    mockAxios
      .onPost(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`)
      .replyOnce(200, {
        rows: [
          {
            doc: storedDocument,
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_get`)
      .replyOnce(200, {
        results: [
          {
            docs: [
              {
                ok: storedDocument,
              },
            ],
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_docs`)
      .replyOnce(200, 'good')

    const result = await resolveConflicts([savingDocument], {
      dbUrl,
      dbName,
      onResolveConflict: () => {
        return resolvedDocument as any
      },
    })

    // expect _bulk_docs to have been called with resolved document
    expect(mockAxios.history.post).toHaveLength(3)
    expect(mockAxios.history.post[2].data).toEqual(
      JSON.stringify({ docs: [resolvedDocument] })
    )
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

    mockAxios
      .onPost(`${dbUrl}/${dbName}/_all_docs?conflicts=true&include_docs=true`)
      .replyOnce(200, {
        rows: [
          {
            doc: storedDocument,
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_get`)
      .replyOnce(200, {
        results: [
          {
            docs: [
              {
                ok: conflictingDocument,
              },
            ],
          },
        ],
      })
      .onPost(`${dbUrl}/${dbName}/_bulk_docs`)
      .replyOnce(200, 'good')

    const result = await resolveConflicts([savingDocument], {
      dbUrl,
      dbName,
      onResolveConflict: () => {
        return resolvedDocument as any
      },
    })

    // expect _bulk_docs to have been called with resolved document and deleted conflict
    expect(mockAxios.history.post).toHaveLength(3)
    expect(mockAxios.history.post[2].data).toEqual(
      JSON.stringify({
        docs: [
          resolvedDocument,
          {
            ...conflictingDocument,
            _deleted: true,
          },
        ],
      })
    )
    expect(result).toEqual('good')
  })
})
