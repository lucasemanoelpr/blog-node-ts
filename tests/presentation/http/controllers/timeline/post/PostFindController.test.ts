import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import PostService from '#domain/timeline/services/PostService';


describe('PostFindController', () => {
  let app: Application
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real PostService instance and mock its methods
    const postService = container.resolve(tokens.PostService) as PostService;
    jest.spyOn(postService, 'find').mockResolvedValue([
      {
        id: '1',
        title: 'Test Post 1',
        content: 'Test content 1'
      },
      {
        id: '2',
        title: 'Test Post 2',
        content: 'Test content 2'
      }
    ]);
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

  it('should find all posts successfully', async () => {
    const response = await request(app)
			.get('/post');
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Posts found successfully');
    expect(response.body.data).toBeInstanceOf(Array);
    expect(response.body.data).toHaveLength(2);
    expect(response.body.data[0]).toHaveProperty('title', 'Test Post 1');
  });

  it('should return empty array when no posts exist', async () => {
		// Mock find to return empty array
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'find').mockResolvedValue([]);

    const response = await request(app)
			.get('/post');
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.data).toEqual([]);
  });

  it('should return 500 when PostService throws an error', async () => {
		// Mock find to throw an error
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'find').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
			.get('/post');
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should handle service timeout gracefully', async () => {
		// Mock find to throw a timeout error
		const postService = container.resolve(tokens.PostService) as PostService;
		jest.spyOn(postService, 'find').mockRejectedValue(new Error('Service timeout'));

    const response = await request(app)
			.get('/post');
			
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should return posts with correct structure', async () => {
    const response = await request(app)
			.get('/post');
			
    expect(response.status).toBe(200);
    expect(response.body.data[0]).toHaveProperty('id');
    expect(response.body.data[0]).toHaveProperty('title');
    expect(response.body.data[0]).toHaveProperty('content');
  });

  it('should work without authentication (public endpoint)', async () => {
    const response = await request(app)
			.get('/post');
			
    expect(response.status).toBe(200);
  });
});
