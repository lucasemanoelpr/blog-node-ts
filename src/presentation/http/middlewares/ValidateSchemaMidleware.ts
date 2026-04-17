import { NextFunction, Request, Response } from 'express'
import * as yup from 'yup'

const validateSchemaMiddleware =
  (schema: yup.Schema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body)
      next()
    } catch (error: any) {
      res.status(422).json({ error: error.message })
    }
  }

export { validateSchemaMiddleware }
