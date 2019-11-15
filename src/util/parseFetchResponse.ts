export default function parseFetchResponse(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  } else {
    const error = new Error(response.statusText)

    // @ts-ignore
    error.response = response
    throw error
  }
}
