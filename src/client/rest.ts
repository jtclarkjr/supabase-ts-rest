import { QueryParams, DoRequestFn } from '../types'

/**
 * Creates REST methods for interacting with database tables and views.
 * @param doRequest - Core HTTP request function
 * @returns An object with REST methods (get, post, put, patch, del)
 */
export function createRestMethods(doRequest: DoRequestFn) {
  return {
    /**
     * Performs a GET request to fetch data from the specified endpoint.
     * 
     * Retrieves records from a database table or view. Supports query parameters
     * for filtering, ordering, and pagination using PostgREST syntax.
     * 
     * @param endpoint - The API endpoint (table name or view)
     * @param queryParams - Optional query parameters for filtering and options
     * @returns Promise resolving to the fetched data
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Get all users
     * const users = await client.get('users');
     * console.log('All users:', users);
     * ```
     * 
     * @example
     * ```typescript
     * // Get users with filters
     * const activeUsers = await client.get('users', {
     *   status: 'eq.active',
     *   age: 'gte.18',
     *   select: 'id,name,email',
     *   order: 'created_at.desc',
     *   limit: 10
     * });
     * console.log('Active adult users:', activeUsers);
     * ```
     * 
     * @example
     * ```typescript
     * // Get specific user by ID
     * const user = await client.get('users', {
     *   id: 'eq.123',
     *   select: '*'
     * });
     * console.log('User details:', user[0]);
     * ```
     */
    async get(endpoint: string, queryParams?: QueryParams): Promise<unknown> {
      if (queryParams) {
        return doRequest('GET', endpoint, queryParams)
      }
      return doRequest('GET', endpoint)
    },

    /**
     * Performs a POST request to create new data in the specified endpoint.
     * 
     * Creates new records in a database table. The data will be validated
     * against the table schema and any constraints.
     * 
     * @param endpoint - The API endpoint (table name)
     * @param data - The data object or array to create
     * @returns Promise resolving to the created data
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Create a single user
     * const newUser = await client.post('users', {
     *   name: 'John Doe',
     *   email: 'john@example.com',
     *   age: 30
     * });
     * console.log('Created user:', newUser);
     * ```
     * 
     * @example
     * ```typescript
     * // Create multiple users at once
     * const newUsers = await client.post('users', [
     *   { name: 'Alice', email: 'alice@example.com', age: 25 },
     *   { name: 'Bob', email: 'bob@example.com', age: 35 }
     * ]);
     * console.log('Created users:', newUsers);
     * ```
     * 
     * @example
     * ```typescript
     * // Create with authentication required
     * client.setToken(authToken);
     * const post = await client.post('posts', {
     *   title: 'My Blog Post',
     *   content: 'This is the content of my post',
     *   published: true
     * });
     * console.log('Published post:', post.id);
     * ```
     */
    async post(endpoint: string, data: unknown): Promise<unknown> {
      return doRequest('POST', endpoint, data)
    },

    /**
     * Performs a PUT request to update a record by primary key.
     * 
     * Replaces an entire record identified by its primary key.
     * All fields not included in the data will be set to null.
     * 
     * @param endpoint - The API endpoint (table name)
     * @param primaryKeyName - The primary key field name (e.g., 'id')
     * @param primaryKeyValue - The primary key value to identify the record
     * @param data - The complete data object to replace the record
     * @returns Promise resolving to the updated data
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Replace entire user record
     * const updatedUser = await client.put('users', 'id', '123', {
     *   name: 'Jane Smith',
     *   email: 'jane@example.com',
     *   age: 28,
     *   status: 'active'
     * });
     * console.log('Updated user:', updatedUser);
     * ```
     * 
     * @example
     * ```typescript
     * // Update product with custom primary key
     * const product = await client.put('products', 'sku', 'ABC-123', {
     *   name: 'Updated Product Name',
     *   price: 29.99,
     *   description: 'New description',
     *   in_stock: true
     * });
     * console.log('Updated product:', product);
     * ```
     */
    async put(
      endpoint: string,
      primaryKeyName: string,
      primaryKeyValue: string,
      data: unknown
    ): Promise<unknown> {
      const queryParams = { [primaryKeyName]: primaryKeyValue }
      return doRequest('PUT', endpoint, data, queryParams)
    },

    /**
     * Performs a PATCH request to partially update records.
     * 
     * Updates specific fields of records matching the query parameters.
     * Only the fields included in the data object will be modified.
     * 
     * @param endpoint - The API endpoint (table name)
     * @param queryParams - Query parameters to identify which records to update
     * @param data - The partial data object with fields to update
     * @returns Promise resolving to the updated data
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Update specific user fields
     * const updated = await client.patch('users', { id: 'eq.123' }, {
     *   last_login: new Date().toISOString(),
     *   login_count: 5
     * });
     * console.log('Updated user fields:', updated);
     * ```
     * 
     * @example
     * ```typescript
     * // Update multiple users matching criteria
     * const bulkUpdate = await client.patch(
     *   'users',
     *   { status: 'eq.pending', created_at: 'lt.2023-01-01' },
     *   { status: 'inactive' }
     * );
     * console.log('Bulk updated users:', bulkUpdate);
     * ```
     * 
     * @example
     * ```typescript
     * // Increment a counter field
     * const likedPost = await client.patch(
     *   'posts',
     *   { id: 'eq.456' },
     *   { likes: 'add.1' } // PostgREST increment syntax
     * );
     * console.log('Post with updated likes:', likedPost);
     * ```
     */
    async patch(
      endpoint: string,
      queryParams: QueryParams,
      data: unknown
    ): Promise<unknown> {
      return doRequest('PATCH', endpoint, data, queryParams)
    },

    /**
     * Performs a DELETE request to remove a record by primary key.
     * 
     * Permanently deletes a record identified by its primary key.
     * This operation cannot be undone.
     * 
     * @param endpoint - The API endpoint (table name)
     * @param primaryKeyName - The primary key field name (e.g., 'id')
     * @param primaryKeyValue - The primary key value to identify the record
     * @returns Promise resolving to the deletion response
     * 
     * @example
     * ```typescript
     * const client = createClient('https://your-project.supabase.co', 'your-anon-key');
     * 
     * // Delete user by ID
     * await client.del('users', 'id', '123');
     * console.log('User deleted successfully');
     * ```
     * 
     * @example
     * ```typescript
     * // Delete with confirmation
     * const userId = '456';
     * const confirmDelete = confirm('Are you sure you want to delete this user?');
     * 
     * if (confirmDelete) {
     *   await client.del('users', 'id', userId);
     *   console.log(`User ${userId} has been deleted`);
     * }
     * ```
     * 
     * @example
     * ```typescript
     * // Delete product by SKU
     * try {
     *   await client.del('products', 'sku', 'OLD-PRODUCT-123');
     *   console.log('Product removed from inventory');
     * } catch (error) {
     *   console.error('Failed to delete product:', error.message);
     * }
     * ```
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
