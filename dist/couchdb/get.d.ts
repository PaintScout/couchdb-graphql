import { CouchDbDocument } from '../types';
import { CouchDbContext } from '../createContext';
export interface GetOptions {
    rev?: string;
    revs?: boolean;
    revs_info?: boolean;
    open_revs?: boolean;
    conflicts?: boolean;
    attachments?: boolean;
    latest?: boolean;
}
export declare function get<T extends CouchDbDocument>(context: CouchDbContext, id: string, options?: GetOptions): Promise<T>;
