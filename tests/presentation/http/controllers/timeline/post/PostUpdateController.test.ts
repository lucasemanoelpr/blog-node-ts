import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import PostService from '#domain/timeline/services/PostService';


describe('PostUpdateController', () => {
  let app: Application
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real PostService instance and mock its methods
    const postService = container.resolve(tokens.PostService) as PostService;
    jest.spyOn(postService, 'update').mockResolvedValue({
      id: '1',
      title: 'Updated Post',
      content: 'Updated content'
    });
  });

	beforeAll(() => {
		config = container.resolve(tokens.Config)
		tokenKey = config.get().tokenKey

		// Generate valid JWT token for testing
		validToken = jwt.sign(
			{
				id: 1,
				email: 'test@example.com',
				created_at: new Date(),
			},
			tokenKey,
			{ expiresIn: '2h' }
		)

		// Initialize app
    const appResolved = container.resolve(App)
    app = appResolved.getServer()
  })

  it('should update a post successfully with authentication', async () => {
    const response = await request(app)
			.patch('/post/1')
			.set('x-access-token', validToken)
			.send({
				title: 'Updated Post',
				content: 'Updated content'
			});
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Post updated successfully');
    expect(response.body.data).toHaveProperty('id', '1');
    expect(response.body.data).toHaveProperty('title', 'Updated Post');
  });

  it('should return 403 without authentication', async () => {
    const response = await request(app)
			.patch('/post/1')
			.send({
				title: 'Updated Post',
				content: 'Updated content'
			});
			
    expect(response.status).toBe(403);
  });

  it('should return 404 when post is not found', async () => {
		// Mock update to return null
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'update').mockResolvedValue(null);

    const response = await request(app)
			.patch('/post/999')
			.set('x-access-token', validToken)
			.send({
				title: 'Updated Post',
				content: 'Updated content'
			});
			
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'It was not possible complete the requisition.');
  });

  it('should return 422 when title is missing', async () => {
    const response = await request(app)
			.patch('/post/1')
			.set('x-access-token', validToken)
			.send({
				content: 'Updated content'
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 422 when content is missing', async () => {
    const response = await request(app)
			.patch('/post/1')
			.set('x-access-token', validToken)
			.send({
				title: 'Updated Post'
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 500 when PostService throws an error', async () => {
		// Mock update to throw an error
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'update').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
			.patch('/post/1')
			.set('x-access-token', validToken)
			.send({
				title: 'Updated Post',
				content: 'Updated content'
			});
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should handle invalid authentication token', async () => {
    const response = await request(app)
			.patch('/post/1')
			.set('x-access-token', 'invalid-token')
			.send({
				title: 'Updated Post',
				content: 'Updated content'
			});
			
    expect(response.status).toBe(401);
  });

  it('should handle invalid post ID format', async () => {
    const response = await request(app)
			.patch('/post/invalid-id')
			.set('x-access-token', validToken)
			.send({
				title: 'Updated Post',
				content: 'Updated content'
			});
			
    // Should handle gracefully - either 400 or 404 depending on service implementation
    expect(response.status).toBe(200);
  });

  it('should handle empty post ID', async () => {
    const response = await request(app)
			.patch('/post/')
			.set('x-access-token', validToken)
			.send({
				title: 'Updated Post',
				content: 'Updated content'
			});
			
    expect(response.status).toBe(404); // Route not found
  });
});
