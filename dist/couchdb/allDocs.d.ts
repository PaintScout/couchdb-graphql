import { CouchDbContext } from '../createContext';
export interface AllDocsOptions {
    conflicts?: boolean;
    endkey?: any | any[];
    include_docs?: boolean;
    inclusive_end?: boolean;
    key?: any | any[];
    keys?: any | any[];
    limit?: number;
    skip?: number;
    startkey?: any | any[];
    update_seq?: boolean;
}
export interface AllDocsResponse<T = any> {
    total_rows: number;
    offset: number;
    rows: Array<{
        id: string;
        rev?: string;
        value?: {
            rev: string;
        };
        doc?: T;
    }>;
}
export declare function allDocs<T = any>(context: CouchDbContext, { keys, key, endkey, startkey, ...args }?: AllDocsOptions): Promise<AllDocsResponse<T>>;
