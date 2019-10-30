import { gql } from 'apollo-server'

export const base = {
  typeDefs: gql`
    scalar JSON
  `,
}
