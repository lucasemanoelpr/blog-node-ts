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
    private postCreateController: IController,
    
    @inject(tokens.PostDeleteController)
    private postDeleteController: IController,

    @inject(tokens.PostFindController)
    private postFindController: IController,

    @inject(tokens.PostFindOneController)
    private postFindOneController: IController,

    @inject(tokens.PostUpdateController)
    private postUpdateController: IController
  ) { }

  setup() {
    const router = Router();
    router.post(
      '/',
      validateSchemaMiddleware(postCreateRequestSchema),
      async (req: Request, res: Response) => {
        return await this.postCreateController.handle(req, res)
      }
    );

    router.get(
      '/',
      async (req: Request, res: Response) => {
        return await this.postFindController.handle(req, res)
      }
    );

    router.get(
      '/:id',
      async (req: Request, res: Response) => {
        return await this.postFindOneController.handle(req, res)
      }
    );

    router.patch(
      '/:id',
      async (req: Request, res: Response) => {
        return await this.postUpdateController.handle(req, res)
      }
    );

    router.delete(
      '/:id',
      async (req: Request, res: Response) => {
        return await this.postDeleteController.handle(req, res)
      }
    );

    return router;
  }
}
