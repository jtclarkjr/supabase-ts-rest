import { QueryParams, DoRequestFn } from '../types';
/**
 * Creates REST methods for interacting with database tables and views.
 * @param doRequest - Core HTTP request function
 * @returns An object with REST methods (get, post, put, patch, del)
 */
export declare function createRestMethods(doRequest: DoRequestFn): {
    /**
     * Performs a GET request to the specified endpoint.
     * @param endpoint - The API endpoint
     * @param queryParams - Optional query parameters
     * @returns The API response
     */
    get(endpoint: string, queryParams?: QueryParams): Promise<unknown>;
    /**
     * Performs a POST request to the specified endpoint.
     * @param endpoint - The API endpoint
     * @param data - The request body
     * @returns The API response
     */
    post(endpoint: string, data: unknown): Promise<unknown>;
    /**
     * Performs a PUT request to update a record by primary key.
     * @param endpoint - The API endpoint
     * @param primaryKeyName - The primary key field name
     * @param primaryKeyValue - The primary key value
     * @param data - The request body
     * @returns The API response
     */
    put(endpoint: string, primaryKeyName: string, primaryKeyValue: string, data: unknown): Promise<unknown>;
    /**
     * Performs a PATCH request to update records.
     * @param endpoint - The API endpoint
     * @param queryParams - Query parameters to identify records
     * @param data - The request body
     * @returns The API response
     */
    patch(endpoint: string, queryParams: QueryParams, data: unknown): Promise<unknown>;
    /**
     * Performs a DELETE request to remove a record by primary key.
     * @param endpoint - The API endpoint
     * @param primaryKeyName - The primary key field name
     * @param primaryKeyValue - The primary key value
     * @returns The API response
     */
    del(endpoint: string, primaryKeyName: string, primaryKeyValue: string): Promise<unknown>;
};
//# sourceMappingURL=rest.d.ts.map