import MockAdapter from 'axios-mock-adapter'
import getAxios from '../../util/getAxios'
import { gql } from 'apollo-server-core'
import {
  createTestServer,
  dbUrl,
  dbName,
} from '../../test/util/createTestServer'
import { resolveConflicts } from '../../util/resolveConflicts'
import asJestMock from '../../test/util/asJestMock'

jest.mock('../../util/getAxios')
jest.mock('../../util/resolveConflicts')

const mockAxios = new MockAdapter(getAxios(null))

const { query } = createTestServer()

describe('bulkDocs', () => {
  afterEach(() => {
    jest.clearAllMocks()
    mockAxios.resetHistory()
  })

  it('should create docs', async () => {
    mockAxios.onPost(`${dbUrl}/${dbName}/_bulk_docs`).reply(200, [
      {
        id: '1',
        rev: '1',
      },
      {
        id: '2',
        rev: '1',
      },
    ])

    const result = await query({
      query: gql`
        mutation save($input: [JSON!]!) {
          bulkDocs(input: $input) {
            _id
            _rev
            document
          }
        }
      `,
      variables: {
        input: [
          {
            _id: '1',
            blah: 'blah',
          },
          {
            _id: '2',
            blah2: 'blah2',
          },
        ],
      },
    })

    expect(result.data).toMatchObject({
      bulkDocs: [
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
      ],
    })
  })

  it('should update docs', async () => {
    mockAxios.onPost(`${dbUrl}/${dbName}/_bulk_docs`).reply(200, [
      {
        id: '1',
        rev: '2',
      },
      {
        id: '2',
        rev: '2',
      },
    ])

    const result = await query({
      query: gql`
        mutation save($input: [JSON!]!) {
          bulkDocs(input: $input) {
            _id
            _rev
            document
          }
        }
      `,
      variables: {
        input: [
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
      },
    })

    expect(result.data).toMatchObject({
      bulkDocs: [
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
      ],
    })
  })

  it('should upsert docs', async () => {
    mockAxios
      .onPost(`${dbUrl}/${dbName}/_all_docs`)
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
      .onPost(`${dbUrl}/${dbName}/_bulk_docs`)
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

    const result = await query({
      query: gql`
        mutation save($input: [JSON!]!) {
          bulkDocs(input: $input, upsert: true) {
            _id
            _rev
            document
          }
        }
      `,
      variables: {
        input: [
          {
            _id: '1',
            blah: 'blah',
          },
          {
            _id: '2',
            blah2: 'blah2',
          },
        ],
      },
    })

    expect(result.data).toMatchObject({
      bulkDocs: [
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
      ],
    })
  })

  it('should have errors for failed docs', async () => {
    mockAxios.onPost(`${dbUrl}/${dbName}/_bulk_docs`).reply(200, [
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

    const result = await query({
      query: gql`
        mutation save($input: [JSON!]!) {
          bulkDocs(input: $input) {
            _id
            _rev
            document
            error
            reason
          }
        }
      `,
      variables: {
        input: [
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
      },
    })

    expect(result.data).toMatchObject({
      bulkDocs: [
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
      ],
    })
  })

  it('should call resolveConflicts for conflicting docs', async () => {
    mockAxios.onPost(`${dbUrl}/${dbName}/_bulk_docs`).reply(200, [
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

    const result = await query({
      query: gql`
        mutation save($input: [JSON!]!) {
          bulkDocs(input: $input) {
            _id
            _rev
            document
          }
        }
      `,
      variables: {
        input: [
          {
            _id: '1',
            _rev: '1',
            blah: 'blah',
          },
        ],
      },
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

    expect(result.data).toMatchObject({
      bulkDocs: [
        {
          _id: '1',
          _rev: '3',
          document: {
            _id: '1',
            _rev: '3',
            blah: 'blah',
          },
        },
      ],
    })
  })

  it('should call context.onDocumentsSaved with result', async () => {
    mockAxios.onPost(`${dbUrl}/${dbName}/_bulk_docs`).reply(200, [
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
    const server = createTestServer({
      onDocumentsSaved,
    })

    await server.query({
      query: gql`
        mutation save($input: [JSON!]!) {
          bulkDocs(input: $input) {
            _id
            _rev
            document
          }
        }
      `,
      variables: {
        input: [
          {
            _id: '1',
            blah: 'blah',
          },
          {
            _id: '2',
            blah2: 'blah2',
          },
        ],
      },
    })

    expect(onDocumentsSaved).toHaveBeenCalledWith([
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
  })
})
