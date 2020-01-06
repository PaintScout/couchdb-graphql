import { CouchDbContext } from '../createContext';
export interface FindOptions {
    selector?: any;
    limit?: number;
    skip?: number;
    sort?: number;
    fields?: string[];
    use_index?: string[];
    r?: number;
    bookmark?: string;
    update?: boolean;
    stable?: boolean;
    stale?: string;
    execution_stats?: boolean;
}
export interface FindResponse<T = any> {
    execution_stats: any;
    bookmark: any;
    warning: string;
    docs: T[];
}
export declare function find<T = any>(context: CouchDbContext, options: FindOptions): Promise<FindResponse<T>>;
