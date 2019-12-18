import { GraphQLFieldResolver } from "graphql";
import { GraphQLModule, GraphQLModuleOptions, Resolvers, ModuleContext } from "@graphql-modules/core";
interface CouchDbDocument {
    _id: string;
    _rev?: string;
    [key: string]: any;
}
declare const base: {
    typeDefs: import("graphql").DocumentNode;
};
interface CouchDbContext {
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
declare function createContext(args: {
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
declare function createResolver<T = any>(resolver: GraphQLFieldResolver<any, CouchDbContext, T>): GraphQLFieldResolver<any, CouchDbContext, T>;
/**
 * Resolves conflicts by calling context.onResolveConflict and saving its result
 */
declare function resolveConflicts(documents: any[], context: CouchDbContext): Promise<any>;
interface PutOptions {
    upsert?: boolean;
    new_edits?: boolean;
}
declare function put<T extends CouchDbDocument>(context: CouchDbContext, doc: T, options?: PutOptions): Promise<T | null>;
/**
 * PUTs a document using _bulk_docs endpoint
 */
declare const typeDefs: import("graphql").DocumentNode;
declare const resolvers: {
    Mutation: {
        put: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
interface BulkDocsResponseObject<T extends CouchDbDocument> {
    _id: string;
    _rev?: string;
    document?: T;
    error?: string;
    reason?: string;
}
declare type BulkDocsResponse<T extends CouchDbDocument> = BulkDocsResponseObject<T>[];
interface BulkDocsOptions {
    upsert?: boolean;
    new_edits?: boolean;
}
declare function bulkDocs<T extends CouchDbDocument>(context: CouchDbContext, docs: any[], options?: BulkDocsOptions): Promise<BulkDocsResponse<T>>;
declare const typeDefs_$0: import("graphql").DocumentNode;
declare const resolvers_$0: {
    Mutation: {
        bulkDocs: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
declare module put_$0 {
    const typeDefs: import("graphql").DocumentNode;
    const resolvers: {
        Mutation: {
            put: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
declare module bulkDocs_$0 {
    const typeDefs_$0: import("graphql").DocumentNode;
    const resolvers_$0: {
        Mutation: {
            bulkDocs: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
interface AllDocsOptions {
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
interface AllDocsResponse<T = any> {
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
declare function allDocs<T = any>(context: CouchDbContext, { keys, key, endkey, startkey, ...args }?: AllDocsOptions): Promise<AllDocsResponse<T>>;
declare const typeDefs_$1: import("graphql").DocumentNode;
declare const resolvers_$1: {
    Query: {
        allDocs: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
interface BulkGetOptions {
    revs?: boolean;
}
interface BulkGetResponse<T extends CouchDbDocument> {
    results: Array<{
        ok?: T;
        error?: {
            id: string;
            rev?: string;
            error: string;
            reason: string;
        };
    }>;
}
declare function bulkGet<T extends CouchDbDocument>(docs: Array<{
    id: string;
    rev?: string;
}>, context: CouchDbContext, { revs }?: BulkGetOptions): Promise<BulkGetResponse<T>>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$2: import("graphql").DocumentNode;
declare const resolvers_$2: {
    Query: {
        bulkGet: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
interface ChangesOptions {
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
interface ChangesResponse {
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
declare function changes(context: CouchDbContext, options: ChangesOptions): Promise<ChangesResponse>;
declare const typeDefs_$3: import("graphql").DocumentNode;
declare const resolvers_$3: {
    Query: {
        changes: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
interface FindOptions {
    selector?: any;
    limit?: number;
    skip?: number;
    sort?: number;
    fields?: string[];
    use_index?: string[];
    r?: number;
    bookmark?: string;
    update?: boolean;
    stable?: boolean;
    stale?: string;
    execution_stats?: boolean;
}
interface FindResponse<T = any> {
    execution_stats: any;
    bookmark: any;
    warning: string;
    docs: T[];
}
declare function find<T = any>(context: CouchDbContext, options: FindOptions): Promise<FindResponse<T>>;
interface GetOptions {
    rev?: string;
    revs?: boolean;
    revs_info?: boolean;
    open_revs?: boolean;
    conflicts?: boolean;
    attachments?: boolean;
    latest?: boolean;
}
declare function get<T extends CouchDbDocument>(context: CouchDbContext, id: string, options?: GetOptions): Promise<T>;
interface InfoResponse {
    db_name: string;
    update_seq: string;
    sizes: {
        file: number;
        external: number;
        active: number;
    };
    purge_seq: number;
    other: {
        data_size: number;
    };
    doc_del_count: number;
    doc_count: number;
    disk_size: number;
    disk_format_version: number;
    data_size: number;
    compact_running: Boolean;
    cluster: {
        q: number;
        n: number;
        w: number;
        r: number;
    };
    instance_start_time: number;
}
declare function info(context: CouchDbContext): Promise<InfoResponse>;
interface QueryOptions {
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
interface QueryResponse<T> {
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
declare function query<T = any>(context: CouchDbContext, { view, ddoc, key, keys, ...options }: QueryOptions): Promise<QueryResponse<T>>;
interface SearchOptions {
    index: string;
    ddoc: string;
    query: string;
    bookmark?: string;
    counts?: string[];
    drilldown?: any;
    group_field?: string;
    group_limit?: number;
    group_sort?: any;
    highlight_fields?: string[];
    highlight_pre_tag?: string;
    highlight_post_tag?: string;
    highlight_number?: number;
    highlight_size?: number;
    include_docs?: boolean;
    include_fields?: string[];
    limit?: number;
    ranges?: any;
    sort?: string | string[];
    stale?: string;
}
interface SearchResponse<T> {
    total_rows: number;
    bookmark: string;
    rows: Array<{
        id: string;
        order: number[];
        fields: Record<string, any>;
        doc?: T;
    }>;
    counts?: any;
}
declare function search<T = any>(context: CouchDbContext, { index, ddoc, ...options }: SearchOptions): Promise<SearchResponse<T>>;
declare const typeDefs_$4: import("graphql").DocumentNode;
declare const resolvers_$4: {
    Query: {
        find: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
/**
 * Generic GET on a document
 */
declare const typeDefs_$5: import("graphql").DocumentNode;
declare const resolvers_$5: {
    Query: {
        get: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
declare const typeDefs_$6: import("graphql").DocumentNode;
declare const resolvers_$6: {
    Query: {
        info: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
declare const typeDefs_$7: import("graphql").DocumentNode;
declare const resolvers_$7: {
    Query: {
        query: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, QueryOptions>;
    };
};
declare const typeDefs_$8: import("graphql").DocumentNode;
declare const resolvers_$8: {
    Query: {
        search: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, SearchOptions>;
    };
};
declare module allDocs_$0 {
    const typeDefs_$1: import("graphql").DocumentNode;
    const resolvers_$1: {
        Query: {
            allDocs: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
declare module bulkGet_$0 {
    const typeDefs_$2: import("graphql").DocumentNode;
    const resolvers_$2: {
        Query: {
            bulkGet: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
declare module changes_$0 {
    const typeDefs_$3: import("graphql").DocumentNode;
    const resolvers_$3: {
        Query: {
            changes: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
declare module find_$0 {
    const typeDefs_$4: import("graphql").DocumentNode;
    const resolvers_$4: {
        Query: {
            find: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
declare module get_$0 {
    const typeDefs_$5: import("graphql").DocumentNode;
    const resolvers_$5: {
        Query: {
            get: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
declare module info_$0 {
    const typeDefs_$6: import("graphql").DocumentNode;
    const resolvers_$6: {
        Query: {
            info: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
        };
    };
}
declare module query_$0 {
    const typeDefs_$7: import("graphql").DocumentNode;
    const resolvers_$7: {
        Query: {
            query: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, QueryOptions>;
        };
    };
}
declare module search_$0 {
    const typeDefs_$8: import("graphql").DocumentNode;
    const resolvers_$8: {
        Query: {
            search: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, SearchOptions>;
        };
    };
}
interface CouchDBModuleOptions<Config = any, Session extends object = any, Context = CouchDbContext, SelfResolvers extends Resolvers<any, ModuleContext<Context>> = Resolvers<any, ModuleContext<Context>>> extends Omit<GraphQLModuleOptions<Config, Session, Context, SelfResolvers>, 'typeDefs' | 'resolvers'> {
    cloudant?: boolean;
}
declare class CouchDBModule<Config = any, Session extends object = any, Context = CouchDbContext, SelfResolvers extends Resolvers<any, ModuleContext<Context>> = Resolvers<any, ModuleContext<Context>>> extends GraphQLModule {
    constructor({ cloudant, ...options }: CouchDBModuleOptions<Config, Session, Context, SelfResolvers>, moduleConfig?: Config);
}
export { put_$0, bulkDocs_$0, get_$0, info_$0, bulkGet_$0, changes_$0, search_$0, find_$0, query_$0, allDocs_$0, AllDocsOptions, AllDocsResponse, allDocs, BulkDocsResponseObject, BulkDocsResponse, BulkDocsOptions, bulkDocs, BulkGetOptions, BulkGetResponse, bulkGet, ChangesOptions, ChangesResponse, changes, FindOptions, FindResponse, find, GetOptions, get, InfoResponse, info, put, QueryOptions, QueryResponse, query, SearchOptions, SearchResponse, search, CouchDBModuleOptions, CouchDBModule, CouchDbContext, createContext, resolveConflicts, createResolver, CouchDbDocument, queries, mutations, base };
