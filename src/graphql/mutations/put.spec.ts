import { gql } from 'apollo-server-core'
import { put } from '../../couchdb'
import asJestMock from '../../test/util/asJestMock'
import { createTestServer } from '../../test/util/createTestServer'

jest.mock('../../util/getAxios')
jest.mock('../../util/resolveConflicts')
jest.mock('../../couchdb/put')

const { query } = createTestServer()

describe('put', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return correct data', async () => {
    asJestMock(put).mockResolvedValueOnce({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })

    const result = await query({
      query: gql`
        mutation save($input: JSON!) {
          put(input: $input) {
            _id
            _rev
            document
          }
        }
      `,
      variables: {
        input: {
          _id: '1',
          blah: 'blah',
        },
      },
    })

    expect(result.data).toMatchObject({
      put: {
        _id: '1',
        _rev: '1',
        document: {
          _id: '1',
          _rev: '1',
          blah: 'blah',
        },
      },
    })
  })
})
