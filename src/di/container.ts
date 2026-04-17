import { container } from 'tsyringe'
import { tokens } from '#di/tokens'
import PostRepository from '#domain/timeline/repositories/PostRepository'
import PostService from '#domain/timeline/services/PostService'
import PostCreateController from '#presentation/http/controllers/timeline/post/PostCreateController'
import { PostRoutes } from '#presentation/http/routes/PostRoutes'
import { App } from '#presentation/http/App'
import { Routes } from '#presentation/http/Routes'

// Creates a new child container based on root container
const childContainer = container.createChildContainer()

// Generic
childContainer.registerSingleton(tokens.App, App)
childContainer.registerSingleton(tokens.Routes, Routes)

// Timeline
childContainer.registerSingleton(tokens.PostRepository, PostRepository)
childContainer.registerSingleton(tokens.PostService, PostService)
childContainer.registerSingleton(tokens.PostCreateController, PostCreateController)
childContainer.registerSingleton(tokens.PostRoutes, PostRoutes)


export { childContainer as container }