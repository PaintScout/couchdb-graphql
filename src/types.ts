export interface CouchDbDocument {
  _id: string
  _rev?: string
  [key: string]: any
}
