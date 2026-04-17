import { Request, Response } from 'express'

export default interface IController {
  handle(req: Request, res: Response): Promise<Response>
}
