import { SearchOptions } from '../../couchdb/search';
export declare const typeDefs: import("graphql").DocumentNode;
export declare const resolvers: {
    Query: {
        search: import("graphql").GraphQLFieldResolver<any, import("../..").CouchDbContext, SearchOptions>;
    };
};
