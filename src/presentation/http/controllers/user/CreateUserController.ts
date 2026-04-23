import { tokens } from '#di/tokens'
import type IController from '#shared/interfaces/IController'
import { Request, Response } from 'express'
import { inject, injectable } from 'tsyringe'
import BaseController from '../BaseController'
import type IUserService from '#domain/user/interfaces/IUserService'

@injectable()
export class CreateUserController
  extends BaseController
  implements IController {
  constructor(    
    @inject(tokens.UserService)
    private userService: IUserService
  ) {
    super()
  }

  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userForm = {
        name: req.body.name,
        email: String(req.body.email),
        password: req.body.password,
      }

      const userExist = await this.userService.findOneBy({ email: userForm.email });

      if (userExist) {
        return res.status(409).json({ error: 'Usuário já existe' })
      }

      const newUser = await this.userService.register(userForm)
      return this.success(res, 'Usuário criado com sucesso.', newUser, 201)
    } catch (err: any) {
      console.log(err)
      return this.error(res, err.message)
    }
  }
}
