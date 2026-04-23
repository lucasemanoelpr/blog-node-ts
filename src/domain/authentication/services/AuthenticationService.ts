import { tokens } from '#di/tokens'
import { injectable, inject } from 'tsyringe'
import bcryptjs from 'bcryptjs'
import User from '../../user/entities/User.entity'
import type ICommonService from '#shared/interfaces/ICommonService'
import type ICommonRepository from '#shared/interfaces/ICommonRepository'
import CommonService from '#shared/bases/CommonService'
import type ILogin from '../interfaces/ILogin'
import type ITokenService from '../interfaces/ITokenService'

@injectable()
export default class AuthenticationService extends CommonService<User> implements ICommonService<User> {
  constructor(
    @inject(tokens.UserRepository)
    private userRepository: ICommonRepository<User>,
    @inject(tokens.TokenService)
    private tokenService: ITokenService
  ) {
    super(userRepository)
  }

  async login(userLogin: ILogin): Promise<User | void> {
    const user = await this.userRepository.findOneBy({
      email: userLogin.email 
    })

    if (!user) {
      throw new Error('User not found')
    }

    if (userLogin.password == undefined || user.password == undefined) {
      console.log(user)
    }

    const userAuthenticated =
      user &&
      (await bcryptjs.compare(userLogin.password, user.password as string))

    if (!userAuthenticated) {
      throw new Error('Invalid password')
    }

    const token = this.tokenService.generateToken(user)

    user.token = token
    delete user.password
    delete user.created_at

    return user
  }
}
