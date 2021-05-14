import { CouchDbDocument } from '../types';
import { CouchDbContext } from '../createContext';
export interface BulkGetOptions {
    revs?: boolean;
}
export interface BulkGetResponse<T extends CouchDbDocument> {
    results: Array<{
        id: string;
        docs: Array<{
            ok?: T;
            error?: {
                id: string;
                rev?: string;
                error: string;
                reason: string;
            };
        }>;
    }>;
}
export declare function bulkGet<T extends CouchDbDocument>(context: CouchDbContext, docs: Array<{
    id: string;
    rev?: string;
}>, { revs }?: BulkGetOptions): Promise<BulkGetResponse<T>>;
