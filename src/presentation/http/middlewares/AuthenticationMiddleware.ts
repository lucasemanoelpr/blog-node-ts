import { tokens } from '#di/tokens'
import type IConfiguration from '#shared/interfaces/IConfiguration'
import IMiddleware from '#shared/interfaces/IMiddleware'
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { inject, injectable } from 'tsyringe'

@injectable()
export default class AuthenticationMiddleware implements IMiddleware {
  constructor(
    @inject(tokens.Config)
    private config: IConfiguration
  ) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { tokenKey } = this.config.get()
    const token =
      req.body.token || req.query.token || req.headers['x-access-token']

    if (!token) {
      return res.status(403).json({
        success: false,
        error: 'A token is required for authentication.',
      })
    }
    try {
      const userDecoded = jwt.verify(token, tokenKey)
      Object.assign(req, { user: userDecoded })
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Token.',
      })
    }
    return next()
  }
}
