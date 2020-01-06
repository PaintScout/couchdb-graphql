import 'isomorphic-fetch';
import { CouchDbDocument } from './types';
export interface CouchDbContext {
    couchDb: {
        dbUrl: string;
        dbName: string;
        /**
         * The fetch function used by the requests made to the couchdb server
         *
         * default is node-fetch
         */
        fetch: typeof fetch;
        onResolveConflict?: <T extends CouchDbDocument>(args: {
            document: T;
            conflicts: T[];
            context: CouchDbContext;
        }) => T | Promise<T>;
        onConflictsResolved?: <T extends CouchDbDocument>(args: {
            documents: T[];
            context: CouchDbContext;
        }) => any;
        onDocumentsSaved?: <T extends CouchDbDocument>(args: {
            documents: T[];
            context: CouchDbContext;
        }) => any;
    };
}
export declare function createContext(args: {
    dbUrl: CouchDbContext['couchDb']['dbUrl'];
    dbName: CouchDbContext['couchDb']['dbName'];
    /**
     * The fetch function used by the requests made to the couchdb server
     *
     * default is node-fetch
     */
    fetch?: CouchDbContext['couchDb']['fetch'];
    onResolveConflict?: CouchDbContext['couchDb']['onResolveConflict'];
    onConflictsResolved?: CouchDbContext['couchDb']['onConflictsResolved'];
    onDocumentsSaved?: CouchDbContext['couchDb']['onDocumentsSaved'];
}): CouchDbContext;
