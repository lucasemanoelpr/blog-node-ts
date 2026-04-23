import { inject, injectable } from 'tsyringe'
import { NextFunction, Request, Response, Router } from 'express'
import { validateSchemaMiddleware } from '../middlewares/ValidateSchemaMidleware'
import { tokens } from '#di/tokens'
import type IController from '#shared/interfaces/IController'
import type IBaseRoute from '#shared/interfaces/IBaseRoute'
import type IMiddleware from '#shared/interfaces/IMiddleware'
import { postCreateRequestSchema } from '../requestSchemas/post/PostCreateRequestSchema'
import { postUpdateRequestSchema } from '../requestSchemas/post/PostUpdateRequestSchema'


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
    private postUpdateController: IController,

    @inject(tokens.AuthenticationMiddleware)
    private authenticationMiddleware: IMiddleware,
  ) { }

  setup() {
    const router = Router();
    router.post(
      '/',
      this.authenticationMiddleware.handle.bind(this.authenticationMiddleware),
      validateSchemaMiddleware(postCreateRequestSchema),
      async (req: Request, res: Response) => {
        return await this.postCreateController.handle(req, res)
      }
    );

    router.get(
      '/',
      async (req: Request, res: Response, next: NextFunction) => {
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
      this.authenticationMiddleware.handle.bind(this.authenticationMiddleware),
      validateSchemaMiddleware(postUpdateRequestSchema),
      async (req: Request, res: Response) => {
        return await this.postUpdateController.handle(req, res)
      }
    );

    router.delete(
      '/:id',
      this.authenticationMiddleware.handle.bind(this.authenticationMiddleware),
      async (req: Request, res: Response) => {
        return await this.postDeleteController.handle(req, res)
      }
    );

    return router;
  }
}
