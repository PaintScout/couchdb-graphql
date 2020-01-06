import { CouchDbDocument } from '../types';
import { CouchDbContext } from '../createContext';
export interface BulkDocsResponseObject<T extends CouchDbDocument> {
    _id: string;
    _rev?: string;
    document?: T;
    error?: string;
    reason?: string;
}
export declare type BulkDocsResponse<T extends CouchDbDocument> = BulkDocsResponseObject<T>[];
export interface BulkDocsOptions {
    upsert?: boolean;
    new_edits?: boolean;
}
export declare function bulkDocs<T extends CouchDbDocument>(context: CouchDbContext, docs: any[], options?: BulkDocsOptions): Promise<BulkDocsResponse<T>>;
