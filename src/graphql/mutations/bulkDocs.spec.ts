import { gql } from 'apollo-server-core'
import { bulkDocs } from '../../couchdb/bulkDocs'
import asJestMock from '../../test/util/asJestMock'
import { createTestServer } from '../../test/util/createTestServer'

jest.mock('../../util/resolveConflicts')
jest.mock('../../couchdb/bulkDocs')

const { query } = createTestServer()

describe('bulkDocs', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return correct data', async () => {
    asJestMock(bulkDocs).mockReturnValueOnce([
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
})
