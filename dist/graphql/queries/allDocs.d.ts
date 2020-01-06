export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Query: {
        allDocs: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, any>;
    };
};
