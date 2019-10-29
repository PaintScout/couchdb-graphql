import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useParams } from 'react-router'
import TextField from '@material-ui/core/TextField'
import { Button } from '@material-ui/core'
import { SEARCH_QUOTES } from './SearchQuotes'

const GET_QUOTE = gql`
  query getQuote($id: String!) {
    get(id: $id) {
      document
    }
  }
`

const SAVE_QUOTE = gql`
  mutation saveQuote($input: JSON) {
    put(input: $input) {
      document
    }
  }
`
export default function Quote() {
  const { id } = useParams()

  const { loading, error, data } = useQuery(GET_QUOTE, { variables: { id } })
  const [quote, setQuote] = useState(data ? data.get.document : null)
  const [saveQuote, { loading: saving }] = useMutation(SAVE_QUOTE, {
    refetchQueries: [
      { query: GET_QUOTE, variables: { id } },
      { query: SEARCH_QUOTES },
    ],
  })

  useEffect(() => {
    if (!quote && data) {
      setQuote(data.get.document)
    }
  }, [data, quote])

  if (error) return <p>Error :(</p>
  if (loading || !quote) return <p>Loading...</p>

  return (
    <div>
      <h1>Quote #{data.get.document.number}</h1>

      <TextField
        label="Set Number"
        disabled={saving}
        value={quote.number}
        onChange={ev =>
          setQuote({ ...quote, number: parseInt(ev.target.value) || undefined })
        }
      />
      <Button
        variant="outlined"
        disabled={saving}
        onClick={async () => {
          const result = await saveQuote({ variables: { input: quote } })
          setQuote(result.data.put.document)
        }}
      >
        Save
      </Button>
    </div>
  )
}
