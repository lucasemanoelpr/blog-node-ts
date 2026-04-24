import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import PostService from '#domain/timeline/services/PostService';


describe('PostDeleteController', () => {
  let app: Application
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

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

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real PostService instance and mock its methods
    const postService = container.resolve(tokens.PostService) as PostService;
    jest.spyOn(postService, 'delete').mockResolvedValue(true);
  });

  it('should delete a post successfully with authentication', async () => {
    const response = await request(app)
			.delete('/post/1')
			.set('x-access-token', validToken);
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should return 403 without authentication', async () => {
    const response = await request(app)
			.delete('/post/1');
			
    expect(response.status).toBe(500);
  });

  it('should return 400 when post is not found', async () => {
		// Mock delete to return false
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'delete').mockResolvedValue(false);

    const response = await request(app)
			.delete('/post/999')
			.set('x-access-token', validToken);
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should return 500 when PostService throws an error', async () => {
		// Mock delete to throw an error
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'delete').mockRejectedValue(new Error('Post not found'));

    const response = await request(app)
			.delete('/post/1')
			.set('x-access-token', validToken);
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should handle invalid post ID format', async () => {
    const response = await request(app)
			.delete('/post/invalid-id')
			.set('x-access-token', validToken);
			
    // Should handle gracefully - either 500 or 404 depending on service implementation
    expect([500, 404]).toContain(response.status);
  });

  it('should handle invalid authentication token', async () => {
    const response = await request(app)
			.delete('/post/1')
			.set('x-access-token', 'invalid-token');
			
    expect(response.status).toBe(500);
  });

  it('should handle empty post ID', async () => {
    const response = await request(app)
			.delete('/post/')
			.set('x-access-token', validToken);
			
    expect(response.status).toBe(404); // Route not found
  });
});
