import { QueryOptions } from '../../couchdb/query';
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Query: {
        query: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, QueryOptions>;
    };
};
