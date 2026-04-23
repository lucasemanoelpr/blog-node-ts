import { tokens } from '#di/tokens'
import { injectable, inject } from 'tsyringe'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../../user/entities/User.entity'
import type ICommonService from '#shared/interfaces/ICommonService'
import type ICommonRepository from '#shared/interfaces/ICommonRepository'
import CommonService from '#shared/bases/CommonService'
import ICreateUser from '#domain/user/interfaces/ICreateUser'

@injectable()
export default class AuthenticationService extends CommonService<User> implements ICommonService<User> {
  constructor(
    @inject(tokens.UserRepository)
    private userRepository: ICommonRepository<User>
  ) {
    super(userRepository)
  }

  // async createUser(newUser: ICreateUser): Promise<User> {
  //   const userRepository = await this.userRepository.getRepository()
  //   const { name, email, password } = newUser

  //   const encryptedPassword = await bcryptjs.hash(password, 10)

  //   const user: User = await userRepository.save({
  //     name,
  //     email: email.toLowerCase(),
  //     password: encryptedPassword
  //   })

  //   const token_key = process.env.TOKEN_KEY

  //   if (!token_key) {
  //     throw new Error('TOKEN_KEY was not defined in .env')
  //   }

  //   const token = jwt.sign(
  //     {
  //       id: user.id,
  //       email: user.email,
  //       created_at: user.created_at,
  //     },
  //     token_key,
  //     {
  //       expiresIn: '2h',
  //     }
  //   )

  //   user.token = token
  //   delete user.password
  //   delete user.created_at

  //   return user
  // }

  // async passwordReset(email: string): Promise<boolean> {
  //   const userRepository = await this.userRepository.getRepository()
  //   const userFound = await userRepository.findOneBy({ email })

  //   if (userFound) {
  //     const token = email + '_USER_TOKEN_'
  //     const hashedToken = await bcryptjs.hash(token, 10)
  //     await this.userRepository.updateTokenPasswordReset(
  //       userFound.id,
  //       hashedToken
  //     )
  //   }

  //   // WE'LL AWAYS SHOW AS TRUE...
  //   const passwordResetResponse = true
  //   return passwordResetResponse
  // }

  // async login(userLogin: IUserLogin): Promise<User | void> {
  //   const userRepository = await this.userRepository.getRepository()

  //   const user = await userRepository.findOne({
  //     where: { email: userLogin.email },
  //     relations: { company: true },
  //   })

  //   if (!user) {
  //     throw new Error('Unauthenticated user')
  //   }

  //   if (userLogin.password == undefined || user.password == undefined) {
  //     console.log(user)
  //   }

  //   const userAuthenticated =
  //     user &&
  //     (await bcryptjs.compare(userLogin.password, user.password as string))

  //   if (!userAuthenticated) {
  //     throw new Error('Unauthenticated user')
  //   }

  //   const token_key = process.env.TOKEN_KEY

  //   if (!token_key) {
  //     throw new Error('TOKEN_KEY was not defined in .env')
  //   }

  //   const token = jwt.sign(
  //     {
  //       id: user.id,
  //       email: user.email,
  //       company_id: user.company.id,
  //       created_at: user.created_at,
  //     },
  //     token_key,
  //     {
  //       expiresIn: '2h',
  //     }
  //   )

  //   user.token = token
  //   delete user.password
  //   delete user.created_at

  //   return user
  // }

  // async updatePassword(id: string, password: string): Promise<boolean> {
  //   const encryptedPassword = await bcryptjs.hash(password, 10)

  //   const updatePasswordResponse = await this.userRepository.updatePassword(
  //     id,
  //     encryptedPassword
  //   )

  //   return updatePasswordResponse
  // }
}
