import { Router } from 'express'
import { inject, injectable } from 'tsyringe'
import { tokens } from '#di/tokens'
import type IBaseRoute from '#shared/interfaces/IBaseRoute'

@injectable()
export class Routes {
  constructor(   
    @inject(tokens.PostRoutes)
    private postRoutes: IBaseRoute,

    @inject(tokens.UserRoutes)
    private userRoutes: IBaseRoute
  ) { }

  /**
   * Make domain routes available to application.
   */
  public setupRouter() {
    const router = Router()
    router.use('/post', this.postRoutes.setup())  
    router.use('/user', this.userRoutes.setup())  

    return router
  }
}
