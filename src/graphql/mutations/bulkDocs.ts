import { gql } from 'apollo-server'
import axios from 'axios'
import queryString from 'query-string'

/**
 * PUTs a document using _bulk_docs endpoint
 */
export const typeDefs = gql`
  type BulkDocsResponse {
    documents: [JSON!]!
  }

  extend type Mutation {
    bulkDocs(input: [JSON!]!, upsert: Boolean, new_edits: Boolean): PutResponse
  }
`

export const resolvers = {
  Mutation: {
    put: async (parent, { input, upsert, new_edits }, context, info) => {
      let url = `${context.dbUrl}/_bulk_docs`
      let rev = input._rev

      // get previous _rev for upsert
      if (upsert) {
        if (!input._id) {
          throw Error('upsert option requires input to contain _id')
        }

        try {
          const {
            data: { _rev },
          } = await axios.get(`${context.dbUrl}/${input._id}`)
          rev = _rev
        } catch (e) {
          throw Error(
            'Unable to find previous _rev for upsert (does document exist?)'
          )
        }
      }

      const response = await axios.post(url, {
        docs: [{ ...input, _rev: rev }],
        new_edits,
      })

      const [result] = response.data

      if (result.error) {
        throw new Error(result.reason)
      }

      return {
        _id: result.id,
        _rev: result.rev,
        document: {
          ...input,
          _id: result.id,
          _rev: result.rev,
        },
      }
    },
  },
}
