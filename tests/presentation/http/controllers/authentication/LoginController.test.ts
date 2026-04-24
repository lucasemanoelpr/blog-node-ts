import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import AuthenticationService from '#domain/authentication/services/AuthenticationService';


describe('LoginController', () => {
  let app: Application
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real AuthenticationService instance and mock its methods
    const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
    jest.spyOn(authService, 'login').mockResolvedValue({
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      token: 'valid-jwt-token'
    } as any);
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

  it('should login successfully with valid credentials', async () => {
    const response = await request(app)
			.post('/auth/login')
			.send({
				email: 'john.doe@example.com',
				password: 'password'
			});
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Login efetuado com sucesso');
    expect(response.body.data).toHaveProperty('token');
  });

  it('should return 401 with invalid credentials', async () => {
		// Mock login to throw an error
		const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
		jest.spyOn(authService, 'login').mockRejectedValue(new Error('Invalid credentials'));

    const response = await request(app)
			.post('/auth/login')
			.send({
				email: 'john.doe@example.com',
				password: 'wrong-password'
			});
			
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error', 'It was not possible complete the requisition.');
  });

  it('should return 401 when UserService throws an error', async () => {
		// Mock login to throw an error
		const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
		jest.spyOn(authService, 'login').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
			.post('/auth/login')
			.send({
				email: 'john.doe@example.com',
				password: 'password'
			});
			
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should return 422 when email is missing', async () => {
    const response = await request(app)
			.post('/auth/login')
			.send({
				password: 'password'
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 422 when password is missing', async () => {
    const response = await request(app)
			.post('/auth/login')
			.send({
				email: 'john.doe@example.com'
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 422 when email is invalid', async () => {
    const response = await request(app)
			.post('/auth/login')
			.send({
				email: 'invalid-email',
				password: 'password'
			});
			
    expect(response.status).toBe(422);
  });

  it('should handle user not found', async () => {
		// Mock login to throw "User not found" error
		const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
		jest.spyOn(authService, 'login').mockRejectedValue(new Error('User not found'));

    const response = await request(app)
			.post('/auth/login')
			.send({
				email: 'nonexistent@example.com',
				password: 'password'
			});
			
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'It was not possible complete the requisition.');
  });
});
