import { CouchDbDocument } from '../types';
import { CouchDbContext } from '../createContext';
interface PutOptions {
    upsert?: boolean;
    new_edits?: boolean;
}
export declare function put<T extends CouchDbDocument>(context: CouchDbContext, doc: T, options?: PutOptions): Promise<T | null>;
export {};
