/**
 * PUTs a document using _bulk_docs endpoint
 */
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Mutation: {
        put: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
