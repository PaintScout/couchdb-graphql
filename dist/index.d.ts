import { GraphQLResolverMap } from "@apollographql/apollo-tools";
import { GraphQLSchemaModule } from "apollo-server-core";
declare const base: {
    typeDefs: import("graphql").DocumentNode;
};
interface CouchDbDocument {
    _id: string;
    _rev?: string;
    [key: string]: any;
}
interface CouchDbContext {
    dbUrl: string;
    dbName: string;
    onResolveConflict?: <T extends CouchDbDocument>(args: {
        document: T;
        conflicts: T[];
        context: CouchDbContext;
    }) => T;
    onConflictsResolved?: <T extends CouchDbDocument>(documents: T[]) => any;
    onDocumentsSaved?: <T extends CouchDbDocument>(documents: T[]) => any;
}
declare function createResolver(resolver: GraphQLResolverMap<CouchDbContext>): GraphQLResolverMap<CouchDbContext>;
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
declare const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
interface BulkDocsResponseObject {
    _id: string;
    _rev?: string;
    document?: CouchDbDocument;
    error?: string;
    reason?: string;
}
declare type BulkDocsResponse = Array<BulkDocsResponseObject>;
interface BulkDocsOptions {
    upsert?: boolean;
    new_edits?: boolean;
}
declare function bulkDocs(context: CouchDbContext, docs: CouchDbDocument[], options?: BulkDocsOptions): Promise<BulkDocsResponse>;
declare const typeDefs_$0: import("graphql").DocumentNode;
declare const resolvers_$0: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare module put_$0 {
    const typeDefs: import("graphql").DocumentNode;
    const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module bulkDocs_$0 {
    const typeDefs_$0: import("graphql").DocumentNode;
    const resolvers_$0: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
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
declare function allDocs(context: CouchDbContext, { keys, key, endkey, startkey, ...args }?: AllDocsOptions): Promise<AllDocsResponse>;
declare const typeDefs_$1: import("graphql").DocumentNode;
declare const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
interface BulkGetOptions {
    revs?: boolean;
}
interface BulkGetResponse {
    results: Array<{
        ok?: CouchDbDocument;
        error?: {
            id: string;
            rev?: string;
            error: string;
            reason: string;
        };
    }>;
}
declare function bulkGet(docs: Array<{
    id: string;
    rev: string;
}>, context: CouchDbContext, { revs }: BulkGetOptions): Promise<BulkGetResponse>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$2: import("graphql").DocumentNode;
declare const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
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
declare const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
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
interface FindResponse {
    execution_stats: any;
    bookmark: any;
    warning: string;
    docs: any[];
}
declare function find(context: CouchDbContext, options: FindOptions): Promise<any>;
interface GetOptions {
    rev?: string;
    revs?: boolean;
    revs_info?: boolean;
    open_revs?: boolean;
    conflicts?: boolean;
    attachments?: boolean;
    latest?: boolean;
}
declare function get(context: CouchDbContext, id: string, options?: GetOptions): Promise<CouchDbDocument>;
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
    keys: any | any[];
    limit?: number;
    reduce?: boolean;
    skip?: number;
    sorted?: boolean;
    stable?: boolean;
    stale: string;
    startkey?: any | any[];
    update?: string;
    update_seq?: boolean;
}
interface QueryResponse {
    offset: number;
    update_seq: any | any[];
    total_rows: number;
    rows: Array<{
        id: string;
        key?: any | any[];
        value?: any;
    }>;
}
declare function query(context: CouchDbContext, { view, ddoc, ...options }: QueryOptions): Promise<QueryResponse>;
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
interface SearchResponse {
    total_rows: number;
    bookmark: string;
    rows: Array<{
        id: string;
        order: number[];
        fields: Record<string, any>;
    }>;
    counts?: any;
}
declare function search(context: CouchDbContext, { index, ddoc, ...options }: SearchOptions): Promise<any>;
declare const typeDefs_$4: import("graphql").DocumentNode;
declare const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$5: import("graphql").DocumentNode;
declare const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$6: import("graphql").DocumentNode;
declare const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$7: import("graphql").DocumentNode;
declare const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$8: import("graphql").DocumentNode;
declare const resolvers_$8: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare module allDocs_$0 {
    const typeDefs_$1: import("graphql").DocumentNode;
    const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module bulkGet_$0 {
    const typeDefs_$2: import("graphql").DocumentNode;
    const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module changes_$0 {
    const typeDefs_$3: import("graphql").DocumentNode;
    const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module find_$0 {
    const typeDefs_$4: import("graphql").DocumentNode;
    const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module get_$0 {
    const typeDefs_$5: import("graphql").DocumentNode;
    const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module info_$0 {
    const typeDefs_$6: import("graphql").DocumentNode;
    const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module query_$0 {
    const typeDefs_$7: import("graphql").DocumentNode;
    const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module search_$0 {
    const typeDefs_$8: import("graphql").DocumentNode;
    const resolvers_$8: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
interface CreateSchemaOptions {
    /**
     * Includes schemas for cloudant endpoints
     *
     * defaults to true
     */
    cloudant?: boolean;
    schemas?: GraphQLSchemaModule[];
}
/**
 * Creates a GraphQL Schema for CouchDB
 */
declare function createSchema({ schemas, cloudant, }?: CreateSchemaOptions): import("graphql").GraphQLSchema;
export { put_$0, bulkDocs_$0, get_$0, info_$0, bulkGet_$0, changes_$0, search_$0, find_$0, query_$0, allDocs_$0, AllDocsOptions, AllDocsResponse, allDocs, BulkDocsResponseObject, BulkDocsResponse, BulkDocsOptions, bulkDocs, BulkGetOptions, BulkGetResponse, bulkGet, ChangesOptions, ChangesResponse, changes, FindOptions, FindResponse, find, GetOptions, get, InfoResponse, info, put, QueryOptions, QueryResponse, query, SearchOptions, SearchResponse, search, CreateSchemaOptions, createSchema, resolveConflicts, CouchDbDocument, CouchDbContext, createResolver, queries, mutations, base };
