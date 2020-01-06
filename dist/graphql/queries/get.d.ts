/**
 * Generic GET on a document
 */
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Query: {
        get: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
