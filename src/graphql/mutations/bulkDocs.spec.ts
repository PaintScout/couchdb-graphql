import { gql } from 'apollo-server-core'
import {
  createTestServer,
  dbUrl,
  dbName,
} from '../../test/util/createTestServer'

const axios = {
  post: jest.fn(),
}

jest.mock('../../util/getAxios', () => () => axios)

const { query } = createTestServer()

describe('bulkDocs', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should create docs', async () => {
    axios.post.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          rev: '1',
        },
        {
          id: '2',
          rev: '1',
        },
      ],
    })

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
    expect(axios.post).toHaveBeenCalledWith(`${dbUrl}/${dbName}/_bulk_docs`, {
      docs: [
        {
          _id: '1',
          blah: 'blah',
        },
        {
          _id: '2',
          blah2: 'blah2',
        },
      ],
    })
  })

  it('should update docs', async () => {
    axios.post.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          rev: '2',
        },
        {
          id: '2',
          rev: '2',
        },
      ],
    })

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
    expect(axios.post).toHaveBeenCalledWith(`${dbUrl}/${dbName}/_bulk_docs`, {
      docs: [
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
    })
  })

  it('should upsert docs', async () => {
    // allDocs
    axios.post
      .mockResolvedValueOnce({
        data: {
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
        },
      })
      // bulkDocs
      .mockResolvedValueOnce({
        data: [
          {
            id: '1',
            rev: '2',
          },
          {
            id: '2',
            rev: '2',
          },
        ],
      })

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
    expect(axios.post).toHaveBeenCalledWith(`${dbUrl}/${dbName}/_bulk_docs`, {
      docs: [
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
    })
  })

  it('should have errors for failed docs', async () => {
    axios.post.mockResolvedValueOnce({
      data: [
        {
          id: '1',
          error: 'oops',
          reason: 'idk',
        },
        {
          id: '2',
          rev: '2',
        },
      ],
    })

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
})
