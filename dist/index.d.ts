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
    onResolveConflict: <T extends CouchDbDocument>(args: {
        document: T;
        conflicts: T[];
        context: CouchDbContext;
    }) => T;
    onConflictsResolved: <T extends CouchDbDocument>(documents: T[]) => any;
}
/**
 * PUTs a document using _bulk_docs endpoint
 */
declare const typeDefs: import("graphql").DocumentNode;
declare const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$0: import("graphql").DocumentNode;
declare const resolvers_$0: {
    Mutation: {
        bulkDocs: (parent: any, { input, upsert, new_edits }: {
            input: any;
            upsert: any;
            new_edits?: boolean | undefined;
        }, context: any, info: any) => Promise<any>;
    };
};
declare module put {
    const typeDefs: import("graphql").DocumentNode;
    const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module bulkDocs {
    const typeDefs_$0: import("graphql").DocumentNode;
    const resolvers_$0: {
        Mutation: {
            bulkDocs: (parent: any, { input, upsert, new_edits }: {
                input: any;
                upsert: any;
                new_edits?: boolean | undefined;
            }, context: any, info: any) => Promise<any>;
        };
    };
}
declare const typeDefs_$1: import("graphql").DocumentNode;
declare const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$2: import("graphql").DocumentNode;
declare const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$3: import("graphql").DocumentNode;
declare const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$4: import("graphql").DocumentNode;
declare const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$5: import("graphql").DocumentNode;
declare const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$6: import("graphql").DocumentNode;
declare const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$7: import("graphql").DocumentNode;
declare const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare const typeDefs_$8: import("graphql").DocumentNode;
declare const resolvers_$8: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
declare module allDocs {
    const typeDefs_$1: import("graphql").DocumentNode;
    const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module bulkGet {
    const typeDefs_$2: import("graphql").DocumentNode;
    const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module changes {
    const typeDefs_$3: import("graphql").DocumentNode;
    const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module find {
    const typeDefs_$4: import("graphql").DocumentNode;
    const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module get {
    const typeDefs_$5: import("graphql").DocumentNode;
    const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module info {
    const typeDefs_$6: import("graphql").DocumentNode;
    const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module query {
    const typeDefs_$7: import("graphql").DocumentNode;
    const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../../util/createResolver").CouchDbContext>;
}
declare module search {
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
export { put, bulkDocs, get, info, bulkGet, changes, search, find, query, allDocs, CreateSchemaOptions, createSchema, CouchDbContext, queries, mutations, base };
