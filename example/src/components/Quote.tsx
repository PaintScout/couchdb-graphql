import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { useParams } from 'react-router'
import TextField from '@material-ui/core/TextField'
import { Button } from '@material-ui/core'
import { SEARCH_QUOTES } from './SearchQuotes'
import { useSnackbar } from 'notistack'

const GET_QUOTE = gql`
  query getQuote($id: String!) {
    get(id: $id) {
      _id
      document
    }
  }
`

const SAVE_QUOTE = gql`
  mutation saveQuote($input: JSON) {
    put(input: $input, upsert: true) {
      _id
      document
    }
  }
`
export default function Quote() {
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const { loading, error, data } = useQuery(GET_QUOTE, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  })

  const [dirtyQuote, setDirtyQuote] = useState(null)

  const quote = data.get.document || dirtyQuote
  const [saveQuote, { loading: saving }] = useMutation(SAVE_QUOTE, {
    refetchQueries: [
      { query: GET_QUOTE, variables: { id } },
      { query: SEARCH_QUOTES },
    ],
  })

  // useEffect(() => {
  //   if (data && !isDirty) {
  //     setQuote(data.get.document)
  //   }
  // }, [data, isDirty])

  if (error && !data) return <p>Error :(</p>
  if (loading && !data) return <p>Loading...</p>

  return (
    <div>
      <h1>Quote #{quote.number}</h1>
      <h2>_rev: {data && data.get.document._rev}</h2>
      <TextField
        label="Set Number"
        disabled={saving}
        value={quote.number}
        onChange={ev =>
          setDirtyQuote({
            ...quote,
            number: parseInt(ev.target.value) || undefined,
          })
        }
      />
      <Button
        variant="outlined"
        disabled={saving}
        onClick={async () => {
          try {
            const result = await saveQuote({
              variables: { input: quote },
              optimisticResponse: {
                put: {
                  _id: quote._id,
                  document: quote,
                  __typename: 'PutResponse',
                },
              },
              update(cache, { data: { put } }) {
                const data = cache.readQuery({
                  query: GET_QUOTE,
                  variables: { id },
                }) as any

                cache.writeQuery({
                  query: GET_QUOTE,
                  variables: { id },
                  data: {
                    ...data,
                    get: {
                      ...data.get,
                      document: put.document,
                    },
                  },
                })
              },
            })

            enqueueSnackbar('Saved', { variant: 'success' })
          } catch (e) {
            enqueueSnackbar('Error', { variant: 'error' })
          }
        }}
      >
        Save
      </Button>
    </div>
  )
}
