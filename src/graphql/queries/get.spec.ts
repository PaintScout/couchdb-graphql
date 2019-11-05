import { gql } from 'apollo-server-core'
import { get } from '../../couchdb'
import asJestMock from '../../test/util/asJestMock'
import { createTestServer } from '../../test/util/createTestServer'

const { query } = createTestServer()

jest.mock('../../couchdb/get')

describe('get', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return with correct data', async () => {
    asJestMock(get).mockResolvedValueOnce({
      _id: '1',
      _rev: '1',
      blah: 'blah',
    })

    const result = await query({
      query: gql`
        query getMyDocument($id: String!) {
          get(id: $id) {
            _id
            _rev
            document
          }
        }
      `,
      variables: { id: '1' },
    })

    expect(result.data).toMatchObject({
      get: {
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
