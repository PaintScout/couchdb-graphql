import { gql } from 'apollo-server-core'

export const base = {
  typeDefs: gql`
    scalar JSON
  `,
}
