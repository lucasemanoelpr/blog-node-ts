import { inject, injectable } from 'tsyringe'
import { Request, Response, Router } from 'express'
import { validateSchemaMiddleware } from '../middlewares/ValidateSchemaMidleware'
import { tokens } from '#di/tokens'
import type IController from '#shared/interfaces/IController'
import type IBaseRoute from '#shared/interfaces/IBaseRoute'
import { postCreateRequestSchema } from '../requestSchemas/post/PostCreateRequestSchema'

@injectable()
export class PostRoutes implements IBaseRoute {
  constructor(
    @inject(tokens.PostCreateController)
    private postCreateController: IController
  ) { }

  setup() {
    const router = Router()
    router.post(
      '/',
      validateSchemaMiddleware(postCreateRequestSchema),
      async (req: Request, res: Response) => {
        return await this.postCreateController.handle(req, res)
      }
    )

    return router
  }
}
