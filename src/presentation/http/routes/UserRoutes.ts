import { tokens } from '#di/tokens'
import { inject, injectable } from 'tsyringe'
import { Request, Response, Router } from 'express'
import type IController from '#shared/interfaces/IController'
import IBaseRoute from '#shared/interfaces/IBaseRoute'
import { createUserRequestSchema } from '../requestSchemas/user/UserCreateRequestSchema'
import { validateSchemaMiddleware } from '../middlewares/ValidateSchemaMidleware'
import type IMiddleware from '#shared/interfaces/IMiddleware'

@injectable()
export class UserRoutes implements IBaseRoute {
  constructor(
    @inject(tokens.CreateUserController)
    private createUserController: IController,
    
    @inject(tokens.AuthenticationMiddleware)
    private authenticationMiddleware: IMiddleware
  ) {}

  setup() {
    const router = Router()

    router.post(
      '/',
      this.authenticationMiddleware.handle.bind(this.authenticationMiddleware),
      validateSchemaMiddleware(createUserRequestSchema),
      (req: Request, res: Response) =>
        this.createUserController.handle(req, res)
    )

    return router
  }
}
