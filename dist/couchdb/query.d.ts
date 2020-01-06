import { CouchDbContext } from '../createContext';
export interface QueryOptions {
    ddoc: string;
    view: string;
    conflicts?: boolean;
    descending?: boolean;
    endkey?: any | any[];
    group?: boolean;
    group_level?: number;
    include_docs?: boolean;
    attachments?: boolean;
    att_encoding_info?: boolean;
    inclusive_end?: boolean;
    key?: any | any[];
    keys?: any | any[];
    limit?: number;
    reduce?: boolean;
    skip?: number;
    sorted?: boolean;
    stable?: boolean;
    stale?: string;
    startkey?: any | any[];
    update?: string;
    update_seq?: boolean;
}
export interface QueryResponse<T> {
    offset: number;
    update_seq: any | any[];
    total_rows: number;
    rows: Array<{
        id: string;
        key?: any | any[];
        value?: any;
        doc?: T;
    }>;
}
export declare function query<T = any>(context: CouchDbContext, { view, ddoc, key, keys, ...options }: QueryOptions): Promise<QueryResponse<T>>;
