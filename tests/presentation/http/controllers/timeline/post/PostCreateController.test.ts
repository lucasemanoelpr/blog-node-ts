import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import PostService from '#domain/timeline/services/PostService';


describe('PostCreateController', () => {
  let app: Application
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real PostService instance and mock its methods
    const postService = container.resolve(tokens.PostService) as PostService;
    jest.spyOn(postService, 'create').mockResolvedValue({
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

  it('should create a post successfully with authentication', async () => {
    const response = await request(app)
			.post('/post')
			.set('x-access-token', validToken)
			.send({
				title: 'Test Post',
				content: 'This is a test post content'
			});
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Post created successfully');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('title', 'Test Post');
  });

  it('should return 403 without authentication', async () => {
    const response = await request(app)
			.post('/post')
			.send({
				title: 'Test Post',
				content: 'This is a test post content'
			});
			
    expect(response.status).toBe(403);
  });

  it('should return 422 when title is missing', async () => {
    const response = await request(app)
			.post('/post')
			.set('x-access-token', validToken)
			.send({
				content: 'This is a test post content'
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 422 when content is missing', async () => {
    const response = await request(app)
			.post('/post')
			.set('x-access-token', validToken)
			.send({
				title: 'Test Post'
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 500 when PostService throws an error', async () => {
		// Mock create to throw an error
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'create').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
			.post('/post')
			.set('x-access-token', validToken)
			.send({
				title: 'Test Post',
				content: 'This is a test post content'
			});
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should handle invalid authentication token', async () => {
    const response = await request(app)
			.post('/post')
			.set('x-access-token', 'invalid-token')
			.send({
				title: 'Test Post',
				content: 'This is a test post content'
			});
			
    expect(response.status).toBe(401);
  });
});
