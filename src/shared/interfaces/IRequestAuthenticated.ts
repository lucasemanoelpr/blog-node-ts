import { Request } from 'express'

export default interface IRequestAuthenticated extends Request {
  user: {
    id: string
    name: string
    email: string
  }
}
