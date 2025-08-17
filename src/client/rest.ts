import { QueryParams, DoRequestFn } from '../types'

/**
 * Creates REST methods for interacting with database tables and views.
 * @param doRequest - Core HTTP request function
 * @returns An object with REST methods (get, post, put, patch, del)
 */
export function createRestMethods(doRequest: DoRequestFn) {
  return {
    /**
     * Performs a GET request to the specified endpoint.
     * @param endpoint - The API endpoint
     * @param queryParams - Optional query parameters
     * @returns The API response
     */
    async get(endpoint: string, queryParams?: QueryParams): Promise<unknown> {
      return doRequest('GET', endpoint, queryParams)
    },

    /**
     * Performs a POST request to the specified endpoint.
     * @param endpoint - The API endpoint
     * @param data - The request body
     * @returns The API response
     */
    async post(endpoint: string, data: unknown): Promise<unknown> {
      return doRequest('POST', endpoint, undefined, data)
    },

    /**
     * Performs a PUT request to update a record by primary key.
     * @param endpoint - The API endpoint
     * @param primaryKeyName - The primary key field name
     * @param primaryKeyValue - The primary key value
     * @param data - The request body
     * @returns The API response
     */
    async put(
      endpoint: string,
      primaryKeyName: string,
      primaryKeyValue: string,
      data: unknown
    ): Promise<unknown> {
      const queryParams = { [primaryKeyName]: primaryKeyValue }
      return doRequest('PUT', endpoint, queryParams, data)
    },

    /**
     * Performs a PATCH request to update records.
     * @param endpoint - The API endpoint
     * @param queryParams - Query parameters to identify records
     * @param data - The request body
     * @returns The API response
     */
    async patch(
      endpoint: string,
      queryParams: QueryParams,
      data: unknown
    ): Promise<unknown> {
      return doRequest('PATCH', endpoint, queryParams, data)
    },

    /**
     * Performs a DELETE request to remove a record by primary key.
     * @param endpoint - The API endpoint
     * @param primaryKeyName - The primary key field name
     * @param primaryKeyValue - The primary key value
     * @returns The API response
     */
    async del(
      endpoint: string,
      primaryKeyName: string,
      primaryKeyValue: string
    ): Promise<unknown> {
      const queryParams = { [primaryKeyName]: primaryKeyValue }
      return doRequest('DELETE', endpoint, queryParams)
    }
  }
}
