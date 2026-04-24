import request from 'supertest';
import { App } from '#presentation/http/App';
import { container } from '#di/container';
import { Application } from 'express'
import ICreateUser from '#domain/user/interfaces/ICreateUser';
import jwt from 'jsonwebtoken';
import IConfiguration from '#shared/interfaces/IConfiguration';
import { tokens } from '#di/tokens';
import UserService from '#domain/user/services/UserService';


describe('CreateUserController', () => {
  let app: Application
	let body: ICreateUser
	let validToken: string
	let tokenKey: string
	let config: IConfiguration

	beforeEach(() => {
    jest.clearAllMocks();
    
    // Get the real UserService instance and mock its methods
    const userService = container.resolve(tokens.UserService) as UserService;
    jest.spyOn(userService, 'findOneBy').mockResolvedValue(null);
    jest.spyOn(userService, 'register').mockResolvedValue(true);
  });

	beforeAll(() => {
    const appResolved = container.resolve(App)
    app = appResolved.getServer()
		config = container.resolve(tokens.Config)
		tokenKey = config.get().tokenKey

		body = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password',
			password_confirmation: 'password'
    }

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
  })

  it('should require a token to create a user', async () => {
		const response = await request(app).post('/user').send(body);
    expect(response.status).toBe(403);
  });

	it('should create a user', async () => {
    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send(body);
			
    expect(response.status).toBe(201);
  });

  it('should return 409 when user already exists', async () => {
		// Mock findOneBy to return an existing user (truthy value to simulate existing user)
		const userService = container.resolve(tokens.UserService) as UserService;
		jest.spyOn(userService, 'findOneBy').mockResolvedValue({} as any);

    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send(body);
			
    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty('error', 'Usuário já existe');
  });

  it('should return 422 when name is missing', async () => {
    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send({
				...body,
				name: ''
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 422 when email is missing', async () => {
    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send({
				...body,
				email: ''
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 422 when password is missing', async () => {
    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send({
				...body,
				password: ''
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 422 when password_confirmation does not match', async () => {
    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send({
				...body,
				password_confirmation: 'different-password'
			});
			
    expect(response.status).toBe(422);
  });

  it('should return 400 when UserService throws an error', async () => {
		// Mock register to throw an error
		const userService = container.resolve(tokens.UserService) as UserService;
		jest.spyOn(userService, 'register').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send(body);
			
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error', 'It was not possible complete the requisition.');
  });

  it('should handle invalid email format', async () => {
    const response = await request(app)
			.post('/user')
			.set('x-access-token', validToken)
			.send({
				...body,
				email: 'invalid-email'
			});
			
    expect(response.status).toBe(422);
  });
});
