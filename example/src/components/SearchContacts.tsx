import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'

const SEARCH_CONTACTS = gql`
  query searchContacts {
    search(index: "contacts", ddoc: "contacts", query: "*:*") {
      rows {
        id
      }
    }
  }
`

export default function SearchContacts() {
  const { loading, error, data } = useQuery(SEARCH_CONTACTS)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <h1>Contacts</h1>
      <ul>
        {data.search.rows.map(row => (
          <li key={row.id}>{row.id}</li>
        ))}
      </ul>
    </div>
  )
}
