import { CouchDbContext } from '../createContext';
import { GraphQLFieldResolver } from 'graphql';
export declare function createResolver<T = any>(resolver: GraphQLFieldResolver<any, CouchDbContext, T>): GraphQLFieldResolver<any, CouchDbContext, T>;
