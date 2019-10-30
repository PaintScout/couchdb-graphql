import axios from 'axios'
import { gql } from 'apollo-server'
import { createTestServer, dbUrl } from '../../test/util/createTestServer'
import asJestMock from '../../test/util/asJestMock'

const { query } = createTestServer()

jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('get', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get a doc', async () => {
    asJestMock(axios.get).mockResolvedValueOnce({
      data: {
        _id: '1',
        _rev: '1',
        blah: 'blah',
      },
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

    expect(axios.get).toHaveBeenCalledWith(`${dbUrl}/1`)
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

  it('should get a doc with extra options', async () => {
    await query({
      query: gql`
        query getMyDocument {
          get(id: "1", conflicts: true, revs: true) {
            _id
            _rev
            document
          }
        }
      `,
    })

    expect(axios.get).toHaveBeenCalledWith(
      `${dbUrl}/1?conflicts=true&revs=true`
    )
  })
})
