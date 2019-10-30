import { buildFederatedSchema } from '@apollo/federation'
import { GraphQLSchemaModule } from 'apollo-server-core'
import { base } from './graphql/base'
import * as mutations from './graphql/mutations'
import * as queries from './graphql/queries'

export interface CreateSchemaOptions {
  /**
   * Includes schemas for cloudant endpoints
   *
   * defaults to true
   */
  cloudant?: boolean
  schemas?: GraphQLSchemaModule[]
}

/**
 * Creates a GraphQL Schema for CouchDB
 */
export function createSchema({
  schemas = [],
  cloudant = true,
}: CreateSchemaOptions = {}) {
  const { search, ...couchdbQueries } = queries

  return buildFederatedSchema([
    base,
    ...Object.keys(cloudant ? couchdbQueries : queries).map(
      key => queries[key]
    ),
    ...Object.keys(mutations).map(key => mutations[key]),
    ...schemas,
  ])
}
