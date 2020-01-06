import { GraphQLModule, GraphQLModuleOptions, Resolvers, ModuleContext } from '@graphql-modules/core';
import { CouchDbContext } from './createContext';
export interface CouchDBModuleOptions<Config = any, Session extends object = any, Context = CouchDbContext, SelfResolvers extends Resolvers<any, ModuleContext<Context>> = Resolvers<any, ModuleContext<Context>>> extends GraphQLModuleOptions<Config, Session, Context, SelfResolvers> {
    cloudant?: boolean;
}
export declare function createCouchDbModule<Config = any, Session extends object = any, Context = CouchDbContext, SelfResolvers extends Resolvers<any, ModuleContext<Context>> = Resolvers<any, ModuleContext<Context>>>({ cloudant, ...options }: CouchDBModuleOptions<Config, Session, Context, SelfResolvers>, moduleConfig?: Config): GraphQLModule<Config, Session, Context, any>;
