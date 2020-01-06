import { CouchDbContext } from '../createContext';
/**
 * Resolves conflicts by calling context.onResolveConflict and saving its result
 */
export declare function resolveConflicts(documents: any[], context: CouchDbContext): Promise<any>;
