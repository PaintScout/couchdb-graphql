import { CouchDbContext } from '../createContext';
export interface SearchOptions {
    index: string;
    ddoc: string;
    query: string;
    bookmark?: string;
    counts?: string[];
    drilldown?: any;
    group_field?: string;
    group_limit?: number;
    group_sort?: any;
    highlight_fields?: string[];
    highlight_pre_tag?: string;
    highlight_post_tag?: string;
    highlight_number?: number;
    highlight_size?: number;
    include_docs?: boolean;
    include_fields?: string[];
    limit?: number;
    ranges?: any;
    sort?: string | string[];
    stale?: string;
}
export interface SearchResponse<T> {
    total_rows: number;
    bookmark: string;
    rows: Array<{
        id: string;
        order: number[];
        fields: Record<string, any>;
        doc?: T;
    }>;
    counts?: any;
}
export declare function search<T = any>(context: CouchDbContext, { index, ddoc, ...options }: SearchOptions): Promise<SearchResponse<T>>;
