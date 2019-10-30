import { GraphQLResolverMap } from "@apollographql/apollo-tools";
import { GraphQLSchemaModule } from "apollo-server-core";
declare const base: {
    typeDefs: import("graphql").DocumentNode;
};
/**
 * PUTs a document using _bulk_docs endpoint
 */
declare const typeDefs: import("graphql").DocumentNode;
declare const resolvers: {
    Mutation: {
        put: (parent: any, { input, upsert, new_edits }: {
            input: any;
            upsert: any;
            new_edits: any;
        }, context: any, info: any) => Promise<{
            _id: any;
            _rev: any;
            document: any;
        }>;
    };
};
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
    const resolvers: {
        Mutation: {
            put: (parent: any, { input, upsert, new_edits }: {
                input: any;
                upsert: any;
                new_edits: any;
            }, context: any, info: any) => Promise<{
                _id: any;
                _rev: any;
                document: any;
            }>;
        };
    };
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
declare const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$2: import("graphql").DocumentNode;
declare const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
declare const typeDefs_$3: import("graphql").DocumentNode;
declare const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
declare const typeDefs_$4: import("graphql").DocumentNode;
declare const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$5: import("graphql").DocumentNode;
declare const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
/**
 * Generic GET on a document
 */
declare const typeDefs_$6: import("graphql").DocumentNode;
declare const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
declare const typeDefs_$7: import("graphql").DocumentNode;
declare const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
declare const typeDefs_$8: import("graphql").DocumentNode;
declare const resolvers_$8: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
declare module allDocs {
    const typeDefs_$1: import("graphql").DocumentNode;
    const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module bulkGet {
    const typeDefs_$2: import("graphql").DocumentNode;
    const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module changes {
    const typeDefs_$3: import("graphql").DocumentNode;
    const resolvers_$3: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module find {
    const typeDefs_$4: import("graphql").DocumentNode;
    const resolvers_$4: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module get {
    const typeDefs_$5: import("graphql").DocumentNode;
    const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module info {
    const typeDefs_$6: import("graphql").DocumentNode;
    const resolvers_$6: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module query {
    const typeDefs_$7: import("graphql").DocumentNode;
    const resolvers_$7: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module search {
    const typeDefs_$8: import("graphql").DocumentNode;
    const resolvers_$8: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
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
export { put, bulkDocs, get, info, bulkGet, changes, search, find, query, allDocs, CreateSchemaOptions, createSchema, queries, mutations, base };
