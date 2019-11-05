import { CouchDbContext } from '../util/createResolver'
import getAxios from '../util/getAxios'

export interface FindOptions {
  selector?: any
  limit?: number
  skip?: number
  sort?: number
  fields?: string[]
  use_index?: string[]
  r?: number
  bookmark?: string
  update?: boolean
  stable?: boolean
  stale?: string
  execution_stats?: boolean
}

export interface FindResponse {
  execution_stats: any
  bookmark: any
  warning: string
  docs: any[]
}

export async function find(context: CouchDbContext, options: FindOptions) {
  let url = `${context.dbUrl}/${context.dbName}/_find`

  const response = await getAxios(context).post(url, options)

  return response.data
}
