import React from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { Link } from 'react-router-dom'

export const SEARCH_QUOTES = gql`
  query searchQuotes {
    search(index: "quotes", ddoc: "quotes", query: "*:* AND is_invoice:false") {
      rows {
        id
        fields
      }
    }
  }
`

export default function SearchQuotes() {
  const { loading, error, data } = useQuery(SEARCH_QUOTES, {
    notifyOnNetworkStatusChange: true,
  })

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <h1>Quotes</h1>
      <ul>
        {data.search.rows.map(row => (
          <li key={row.id}>
            <Link to={`/quote/${row.id}`}>#{row.fields.number}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
