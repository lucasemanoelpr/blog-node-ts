import User  from '../../user/entities/User.entity'
import ILogin from './ILogin'

export default interface IAuthenticationService {
  login(userLogin: ILogin): Promise<User | void>
  logout(token: string): Promise<void>
  validateToken(token: string): Promise<boolean>
  passwordReset(email: string): Promise<boolean>
}
