import { CouchDbContext } from '../createContext'
import parseFetchResponse from '../util/parseFetchResponse'

export interface InfoResponse {
  db_name: string
  update_seq: string
  sizes: {
    file: number
    external: number
    active: number
  }
  purge_seq: number
  other: {
    data_size: number
  }
  doc_del_count: number
  doc_count: number
  disk_size: number
  disk_format_version: number
  data_size: number
  compact_running: Boolean
  cluster: {
    q: number
    n: number
    w: number
    r: number
  }
  instance_start_time: number
}

export async function info(context: CouchDbContext): Promise<InfoResponse> {
  const { fetch, dbUrl, dbName } = context.couchDb
  let url = `${dbUrl}/${dbName}`

  const response = await fetch(url).then(parseFetchResponse)

  return response
}
