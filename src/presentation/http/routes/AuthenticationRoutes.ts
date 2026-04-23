import { tokens } from '#di/tokens'
import { inject, injectable } from 'tsyringe'
import type IController from '#shared/interfaces/IController'
import { Request, Response, Router } from 'express'
// import { validateSchemaMiddleware } from '#presentation/http/middlewares/ValidateSchemaMiddleware'
// import { loginSchema } from '#presentation/http/requestSchemas/authentication/LoginRequestSchema'
// import { newUserRequestSchema } from '#presentation/http/requestSchemas/authentication/NewUserRequestSchema'
// import { passwordResetRequestSchema } from '#presentation/http/requestSchemas/authentication/PasswordResetRequestSchema'
import IBaseRoute from '#shared/interfaces/IBaseRoute'

@injectable()
export class AuthenticationRoutes implements IBaseRoute {
  constructor(
    // @inject(tokens.LoginController)
    // private loginController: IController,

    // @inject(tokens.CreateUserController)
    // private createUserController: IController,

    // @inject(tokens.PasswordResetController)
    // private passwordResetController: IController
  ) {}

  setup() {
    const router = Router()
    // router.post(
    //   '/login',
    //   validateSchemaMiddleware(loginSchema),
    //   (req: Request, res: Response) => this.loginController.handle(req, res)
    // )

    // router.post(
    //   '/user',
    //   validateSchemaMiddleware(newUserRequestSchema),
    //   (req: Request, res: Response) =>
    //     this.createUserController.handle(req, res)
    // )

    // router.post(
    //   '/password-reset',
    //   validateSchemaMiddleware(passwordResetRequestSchema),
    //   (req: Request, res: Response) =>
    //     this.passwordResetController.handle(req, res)
    // )

    return router
  }
}
