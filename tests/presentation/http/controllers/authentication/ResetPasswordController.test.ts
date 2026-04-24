import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import AuthenticationService from '#domain/authentication/services/AuthenticationService';


describe('ResetPasswordController', () => {
  let app: Application
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real AuthenticationService instance and mock its methods
    const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
    jest.spyOn(authService, 'passwordReset').mockResolvedValue(true);
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

  it('should send password reset email successfully', async () => {
    const response = await request(app)
			.post('/auth/password-reset')
			.send({
				email: 'john.doe@example.com'
			});
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Email for resetting password sent');
  });

  it('should handle case when email is not sent', async () => {
		// Mock passwordReset to return false
		const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
		jest.spyOn(authService, 'passwordReset').mockResolvedValue(false);

    const response = await request(app)
			.post('/auth/password-reset')
			.send({
				email: 'john.doe@example.com'
			});
			
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Email for resetting password was not sent.');
  });

  it('should return 422 when email is missing', async () => {
    const response = await request(app)
			.post('/auth/password-reset')
			.send({});
			
    expect(response.status).toBe(422);
  });

  it('should return 400 when user not found', async () => {
		// Mock passwordReset to throw an error
		const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
		jest.spyOn(authService, 'passwordReset').mockRejectedValue(new Error('User not found'));

    const response = await request(app)
			.post('/auth/password-reset')
			.send({
				email: 'nonexistent@example.com'
			});
			
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
  });

  it('should handle service errors gracefully', async () => {
		// Mock passwordReset to throw a generic error
		const authService = container.resolve(tokens.AuthenticationService) as AuthenticationService;
		jest.spyOn(authService, 'passwordReset').mockRejectedValue(new Error('Service unavailable'));

    const response = await request(app)
			.post('/auth/password-reset')
			.send({
				email: 'john.doe@example.com'
			});
			
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
  });
});
