import { tokens } from '#di/tokens'
import type IAuthenticationService from '#domain/authentication/interfaces/IAuthenticationService'
import IController from '#shared/interfaces/IController'
import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import BaseController from '../BaseController'

@injectable()
export class LoginController extends BaseController implements IController {
  constructor(
    @inject(tokens.AuthenticationService)
    private authenticationService: IAuthenticationService
  ) {
    super()
  }

  async handle(req: Request, res: Response): Promise<Response> {
    const userLogin = {
      email: req.body.email,
      password: req.body.password,
    }

    try {
      const userLogged = await this.authenticationService.login(userLogin)
      return this.success(res, 'Login efetuado com sucesso', userLogged)
    } catch (err: any) {
      console.log(err)
      return this.error(res, err.message, 401)
    }
  }
}
