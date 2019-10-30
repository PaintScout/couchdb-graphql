import { GraphQLResolverMap } from "@apollographql/apollo-tools";
import { ApolloServer, GraphQLSchemaModule } from "apollo-server";
import { ContextFunction, Context } from "apollo-server-core";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";
/**
 * Generic GET on a document
 */
declare const typeDefs: import("graphql").DocumentNode;
declare const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
declare const typeDefs_$0: import("graphql").DocumentNode;
declare const resolvers_$0: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
/**
 * Generic GET on a document
 */
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
declare const typeDefs_$5: import("graphql").DocumentNode;
declare const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<{
    dbName: string;
    dbUrl: string;
}>;
declare module get {
    const typeDefs: import("graphql").DocumentNode;
    const resolvers: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module changes {
    const typeDefs_$0: import("graphql").DocumentNode;
    const resolvers_$0: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module bulkGet {
    const typeDefs_$1: import("graphql").DocumentNode;
    const resolvers_$1: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module info {
    const typeDefs_$2: import("graphql").DocumentNode;
    const resolvers_$2: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
declare module search {
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
declare module query {
    const typeDefs_$5: import("graphql").DocumentNode;
    const resolvers_$5: import("@apollographql/apollo-tools").GraphQLResolverMap<{
        dbName: string;
        dbUrl: string;
    }>;
}
/**
 * PUTs a document using _bulk_docs endpoint
 */
declare const typeDefs_$6: import("graphql").DocumentNode;
declare const resolvers_$6: {
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
declare const typeDefs_$7: import("graphql").DocumentNode;
declare const resolvers_$7: {
    Mutation: {
        bulkDocs: (parent: any, { input, upsert, new_edits }: {
            input: any;
            upsert: any;
            new_edits: any;
        }, context: any, info: any) => Promise<any>;
    };
};
declare module put {
    const typeDefs_$6: import("graphql").DocumentNode;
    const resolvers_$6: {
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
    const typeDefs_$7: import("graphql").DocumentNode;
    const resolvers_$7: {
        Mutation: {
            bulkDocs: (parent: any, { input, upsert, new_edits }: {
                input: any;
                upsert: any;
                new_edits: any;
            }, context: any, info: any) => Promise<any>;
        };
    };
}
interface CreateServerOptions {
    dbUrl: string;
    setContext?: ContextFunction<ExpressContext, Context>;
    schemas?: GraphQLSchemaModule[];
}
declare function createServer({ dbUrl, setContext, schemas, }: CreateServerOptions): ApolloServer;
export { get, info, bulkGet, changes, search, find, query, put, bulkDocs, CreateServerOptions, createServer };
