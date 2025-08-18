"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRestMethods = createRestMethods;
/**
 * Creates REST methods for interacting with database tables and views.
 * @param doRequest - Core HTTP request function
 * @returns An object with REST methods (get, post, put, patch, del)
 */
function createRestMethods(doRequest) {
    return {
        /**
         * Performs a GET request to the specified endpoint.
         * @param endpoint - The API endpoint
         * @param queryParams - Optional query parameters
         * @returns The API response
         */
        async get(endpoint, queryParams) {
            if (queryParams) {
                return doRequest('GET', endpoint, queryParams);
            }
            return doRequest('GET', endpoint);
        },
        /**
         * Performs a POST request to the specified endpoint.
         * @param endpoint - The API endpoint
         * @param data - The request body
         * @returns The API response
         */
        async post(endpoint, data) {
            return doRequest('POST', endpoint, data);
        },
        /**
         * Performs a PUT request to update a record by primary key.
         * @param endpoint - The API endpoint
         * @param primaryKeyName - The primary key field name
         * @param primaryKeyValue - The primary key value
         * @param data - The request body
         * @returns The API response
         */
        async put(endpoint, primaryKeyName, data, primaryKeyValue) {
            const queryParams = { [primaryKeyName]: primaryKeyValue };
            return doRequest('PUT', endpoint, data, queryParams);
        },
        /**
         * Performs a PATCH request to update records.
         * @param endpoint - The API endpoint
         * @param queryParams - Query parameters to identify records
         * @param data - The request body
         * @returns The API response
         */
        async patch(endpoint, data, queryParams) {
            return doRequest('PATCH', endpoint, data, queryParams);
        },
        /**
         * Performs a DELETE request to remove a record by primary key.
         * @param endpoint - The API endpoint
         * @param primaryKeyName - The primary key field name
         * @param primaryKeyValue - The primary key value
         * @returns The API response
         */
        async del(endpoint, primaryKeyName, primaryKeyValue) {
            const queryParams = { [primaryKeyName]: primaryKeyValue };
            return doRequest('DELETE', endpoint, queryParams);
        }
    };
}
//# sourceMappingURL=rest.js.map