import getAxios from '../util/getAxios'
import { CouchDbContext } from '../util/createResolver'

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
  let url = `${context.dbUrl}`

  const response = await getAxios(context).get(url)

  return response.data
}
