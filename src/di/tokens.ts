export const tokens = {
    // Generic
    Routes: Symbol('Routes'),
    App: Symbol('App'),
    Config: Symbol('Config'),

    // Authentication
    UserRepository: Symbol('UserRepository'),
    AuthenticationService: Symbol('AuthenticationService'),
    
    // User
    UserService: Symbol('UserService'),
    CreateUserController: Symbol('CreateUserController'),
    UserRoutes: Symbol('UserRoutes'),
    
    // Post
    PostRepository: Symbol('PostRepository'),
    PostService: Symbol('PostService'),
    PostCreateController: Symbol('PostCreateController'),
    PostDeleteController: Symbol('PostDeleteController'),
    PostFindController: Symbol('PostFindController'),
    PostFindOneController: Symbol('PostFindOneController'),
    PostUpdateController: Symbol('PostUpdateController'),
    PostRoutes: Symbol('PostRoutes')
}
