import { CouchDbContext } from '../createContext';
export interface ChangesOptions {
    doc_ids?: string[];
    conflicts?: boolean;
    descending?: boolean;
    feed?: string;
    filter?: string;
    heartbeat?: number;
    include_docs?: boolean;
    attachments?: boolean;
    att_encoding_info?: boolean;
    lastEventId?: number;
    limit?: number;
    since?: string | number;
    timeout?: number;
    view?: string;
    seq_interval?: number;
}
export interface ChangesResponse {
    last_seq: any;
    pending: number;
    results: Array<{
        changes: Array<{
            rev: string;
        }>;
        id: string;
        seq: any;
        doc: any;
        deleted?: boolean;
    }>;
}
export declare function changes(context: CouchDbContext, options: ChangesOptions): Promise<ChangesResponse>;
