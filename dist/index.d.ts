import { GraphQLSchemaModule } from "apollo-server-core";
import { GraphQLResolverMap } from "@apollographql/apollo-tools";
declare const base: {
    typeDefs: import("graphql").DocumentNode;
};
/**
 * PUTs a document using _bulk_docs endpoint
 */
declare const typeDefs: import("graphql").DocumentNode;
declare const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
declare const typeDefs_$0: import("graphql").DocumentNode;
declare const resolvers_$0: {
    Mutation: {
        bulkDocs: (parent: any, { input, upsert, new_edits }: {
            input: any;
            upsert: any;
            new_edits: any;
        }, context: any, info: any) => Promise<any>;
    };
};
declare module put {
    const typeDefs: import("graphql").DocumentNode;
    const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module bulkDocs {
    const typeDefs_$0: import("graphql").DocumentNode;
    const resolvers_$0: {
        Mutation: {
            bulkDocs: (parent: any, { input, upsert, new_edits }: {
                input: any;
                upsert: any;
                new_edits: any;
            }, context: any, info: any) => Promise<any>;
        };
    };
}
declare const typeDefs_$1: import("graphql").DocumentNode;
declare const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$2: import("graphql").DocumentNode;
declare const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
declare const typeDefs_$3: import("graphql").DocumentNode;
declare const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
declare const typeDefs_$4: import("graphql").DocumentNode;
declare const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$5: import("graphql").DocumentNode;
declare const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$6: import("graphql").DocumentNode;
declare const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
declare const typeDefs_$7: import("graphql").DocumentNode;
declare const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
declare const typeDefs_$8: import("graphql").DocumentNode;
declare const resolvers_$8: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
declare module allDocs {
    const typeDefs_$1: import("graphql").DocumentNode;
    const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module bulkGet {
    const typeDefs_$2: import("graphql").DocumentNode;
    const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module changes {
    const typeDefs_$3: import("graphql").DocumentNode;
    const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module find {
    const typeDefs_$4: import("graphql").DocumentNode;
    const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module get {
    const typeDefs_$5: import("graphql").DocumentNode;
    const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module info {
    const typeDefs_$6: import("graphql").DocumentNode;
    const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module query {
    const typeDefs_$7: import("graphql").DocumentNode;
    const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
}
declare module search {
    const typeDefs_$8: import("graphql").DocumentNode;
    const resolvers_$8: import("@apollographql/apollo-tools").GraphQLResolverMap<import("../..").CouchDbContext>;
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
interface CouchDbDocument {
    _id: string;
    _rev?: string;
}
export interface CouchDbContext {
    dbUrl: string;
    dbName: string;
    onResolveConflict: <T extends CouchDbDocument>(args: {
        document: T;
        conflicts: T[];
        context: CouchDbContext;
    }) => T;
}
export { put, bulkDocs, get, info, bulkGet, changes, search, find, query, allDocs, CreateSchemaOptions, createSchema, queries, mutations, base };
