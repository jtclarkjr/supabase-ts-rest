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
      if (queryParams) {
        return doRequest('GET', endpoint, queryParams)
      }
      return doRequest('GET', endpoint)
    },

    /**
     * Performs a POST request to the specified endpoint.
     * @param endpoint - The API endpoint
     * @param data - The request body
     * @returns The API response
     */
    async post(endpoint: string, data: unknown): Promise<unknown> {
      return doRequest('POST', endpoint, data)
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
      data: unknown,
      primaryKeyValue: string
    ): Promise<unknown> {
      const queryParams = { [primaryKeyName]: primaryKeyValue }
      return doRequest('PUT', endpoint, data, queryParams)
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
      data: unknown,
      queryParams: QueryParams
    ): Promise<unknown> {
      return doRequest('PATCH', endpoint, data, queryParams)
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
