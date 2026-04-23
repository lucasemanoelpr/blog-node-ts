import { container } from 'tsyringe'
import { tokens } from '#di/tokens'
import PostRepository from '#domain/timeline/repositories/PostRepository'
import PostService from '#domain/timeline/services/PostService'
import PostCreateController from '#presentation/http/controllers/timeline/post/PostCreateController'
import { PostRoutes } from '#presentation/http/routes/PostRoutes'
import { App } from '#presentation/http/App'
import { Routes } from '#presentation/http/Routes'
import PostDeleteController from '#presentation/http/controllers/timeline/post/PostDeleteController'
import PostFindController from '#presentation/http/controllers/timeline/post/PostFindController'
import PostFindOneController from '#presentation/http/controllers/timeline/post/PostFindOneController'
import PostUpdateController from '#presentation/http/controllers/timeline/post/PostUpdateController'
import UserRepository from '#domain/user/repositories/UserRepository'
import AuthenticationService from '#domain/authentication/services/AuthenticationService'
import UserService from '#domain/user/services/UserService'
import { CreateUserController } from '#presentation/http/controllers/user/CreateUserController'
import { UserRoutes } from '#presentation/http/routes/UserRoutes'
import TokenService from '#domain/authentication/services/TokenService'
import { LoginController } from '#presentation/http/controllers/authentication/LoginController'
import { AuthenticationRoutes } from '#presentation/http/routes/AuthenticationRoutes'
import { Config } from '#config/Config'

// Creates a new child container based on root container
const childContainer = container.createChildContainer()

// Generic
childContainer.registerSingleton(tokens.App, App)
childContainer.registerSingleton(tokens.Routes, Routes)
childContainer.registerSingleton(tokens.Config, Config)

// Timeline
childContainer.registerSingleton(tokens.PostRepository, PostRepository)
childContainer.registerSingleton(tokens.PostService, PostService)
childContainer.registerSingleton(tokens.PostCreateController, PostCreateController)
childContainer.registerSingleton(tokens.PostDeleteController, PostDeleteController)
childContainer.registerSingleton(tokens.PostFindController, PostFindController)
childContainer.registerSingleton(tokens.PostFindOneController, PostFindOneController)
childContainer.registerSingleton(tokens.PostUpdateController, PostUpdateController)
childContainer.registerSingleton(tokens.PostRoutes, PostRoutes)

// Authentication
childContainer.registerSingleton(tokens.UserRepository, UserRepository)
childContainer.registerSingleton(tokens.AuthenticationService, AuthenticationService)
childContainer.registerSingleton(tokens.TokenService, TokenService)
childContainer.registerSingleton(tokens.LoginController, LoginController)
childContainer.registerSingleton(tokens.AuthenticationRoutes, AuthenticationRoutes)

// User
childContainer.registerSingleton(tokens.UserService, UserService)
childContainer.registerSingleton(tokens.CreateUserController, CreateUserController)
childContainer.registerSingleton(tokens.UserRoutes, UserRoutes)

export { childContainer as container }