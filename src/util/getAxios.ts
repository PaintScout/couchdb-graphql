import axios from 'axios'

export default function getAxios(context: any) {
  return axios.create({
    headers: context.dbHeaders,
  })
}
