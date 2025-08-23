/**
 * Example usage demonstrating the flattened client structure
 * 
 * This file demonstrates that when you use methods like client.post(),
 * the IDE should now navigate directly to the method implementation
 * instead of going through spread operators.
 */

import { createClient } from '../src'

// Create a client
const client = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
)

async function exampleUsage() {
  try {
    // Auth methods - should navigate directly to implementation
    const authResult = await client.signIn('user@example.com', 'password123')
    client.setToken(authResult.access_token)

    // User methods - should navigate directly to implementation
    const user = await client.getUser()
    console.log('Current user:', user)

    // REST methods - should navigate directly to implementation
    // When you CMD+click or F12 on .post(), it should go directly to the post method
    const newPost = await client.post('posts', {
      title: 'My Blog Post',
      content: 'This is the content'
    })
    console.log('Created post:', newPost)

    // Get posts with filters
    const posts = await client.get('posts', {
      status: 'eq.published',
      order: 'created_at.desc',
      limit: '10'
    })
    console.log('Published posts:', posts)

    // Update a post
    const updated = await client.patch('posts', { id: 'eq.123' }, {
      title: 'Updated Title'
    })
    console.log('Updated post:', updated)

    // Delete method (alias)
    await client.delete('posts', 'id', '456')
    console.log('Post deleted')

  } catch (error) {
    console.error('Error:', error)
  }
}

export { exampleUsage }
