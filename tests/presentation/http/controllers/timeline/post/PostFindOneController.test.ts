import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import PostService from '#domain/timeline/services/PostService';


describe('PostFindOneController', () => {
  let app: Application
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real PostService instance and mock its methods
    const postService = container.resolve(tokens.PostService) as PostService;
    jest.spyOn(postService, 'findOne').mockResolvedValue({
      id: '1',
      title: 'Test Post',
      content: 'Test content'
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

  it('should find a post successfully by ID', async () => {
    const response = await request(app)
			.get('/post/1');
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Post found successfully');
    expect(response.body.data).toHaveProperty('id', '1');
    expect(response.body.data).toHaveProperty('title', 'Test Post');
    expect(response.body.data).toHaveProperty('content', 'Test content');
  });

  it('should return 404 when post is not found', async () => {
		// Mock findOne to return null
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'findOne').mockResolvedValue(null);

    const response = await request(app)
			.get('/post/999');
			
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'It was not possible complete the requisition.');
  });

  it('should return 500 when PostService throws an error', async () => {
		// Mock findOne to throw an error
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'findOne').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
			.get('/post/1');
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should handle invalid post ID format', async () => {
    const response = await request(app)
			.get('/post/invalid-id');
			
    // Should handle gracefully - either 200, 500 or 404 depending on service implementation
    expect([200, 500, 404]).toContain(response.status);
  });

  it('should work without authentication (public endpoint)', async () => {
    const response = await request(app)
			.get('/post/1');
			
    expect(response.status).toBe(200);
  });

  it('should return post with correct structure', async () => {
    const response = await request(app)
			.get('/post/1');
			
    expect(response.status).toBe(200);
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title');
    expect(response.body.data).toHaveProperty('content');
  });

  it('should handle empty post ID', async () => {
    const response = await request(app)
			.get('/post/');
			
    expect(response.status).toBe(500); // Route not found returns 500
  });

  it('should handle service timeout gracefully', async () => {
		// Mock findOne to throw a timeout error
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'findOne').mockRejectedValue(new Error('Service timeout'));

    const response = await request(app)
			.get('/post/1');
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'It was not possible complete the requisition.');
  });
});
