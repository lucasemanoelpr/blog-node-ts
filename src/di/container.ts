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

// Creates a new child container based on root container
const childContainer = container.createChildContainer()

// Generic
childContainer.registerSingleton(tokens.App, App)
childContainer.registerSingleton(tokens.Routes, Routes)

// Timeline
childContainer.registerSingleton(tokens.PostRepository, PostRepository)
childContainer.registerSingleton(tokens.PostService, PostService)
childContainer.registerSingleton(tokens.PostCreateController, PostCreateController)
childContainer.registerSingleton(tokens.PostDeleteController, PostDeleteController)
childContainer.registerSingleton(tokens.PostFindController, PostFindController)
childContainer.registerSingleton(tokens.PostFindOneController, PostFindOneController)
childContainer.registerSingleton(tokens.PostUpdateController, PostUpdateController)
childContainer.registerSingleton(tokens.PostRoutes, PostRoutes)

export { childContainer as container }