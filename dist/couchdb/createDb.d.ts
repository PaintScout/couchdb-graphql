import { CouchDbDocument } from '../types';
import { CouchDbContext } from '../createContext';
export declare function createDb<T extends CouchDbDocument>(context: CouchDbContext): Promise<T>;
