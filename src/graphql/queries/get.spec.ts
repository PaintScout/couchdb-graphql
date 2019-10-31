import { gql } from 'apollo-server-core'
import {
  createTestServer,
  dbUrl,
  dbName,
} from '../../test/util/createTestServer'

const { query } = createTestServer()

const axios = {
  get: jest.fn(),
}

jest.mock('../../util/getAxios', () => () => axios)

describe('get', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should get a doc', async () => {
    axios.get.mockResolvedValueOnce({
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

    expect(axios.get).toHaveBeenCalledWith(`${dbUrl}/${dbName}/1`)
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
      `${dbUrl}/${dbName}/1?revs=true&conflicts=true`
    )
  })
})
