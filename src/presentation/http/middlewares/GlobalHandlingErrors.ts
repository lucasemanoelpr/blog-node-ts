import { Request, Response, NextFunction } from 'express'
import { QueryFailedError } from 'typeorm'
import AppError from '../errors/AppError'

interface ErrorHandler {
  test: (error: Error) => boolean
  handle: (error: Error, res: Response) => Response | null
}

const createErrorResponse = (status: number, details: string, res: Response): Response => {
  return res.status(status).json({
    success: false,
    error: 'It was not possible complete the requisition.',
    details,
  })
}

const errorHandlers: ErrorHandler[] = [
  // AppError personalizados
  {
    test: (error) => error instanceof AppError,
    handle: (error, res) => {
      const appError = error as unknown as AppError
      return res.status(appError.statusCode).json({
        success: false,
        error: 'It was not possible complete the requisition.',
        details: appError.message.description || appError.message,
      })
    }
  },
  
  // Erros do TypeORM/PostgreSQL
  {
    test: (error) => error instanceof QueryFailedError,
    handle: (error, res) => {
      const driverError = (error as QueryFailedError).driverError as any
      const errorCode = driverError?.code as string
      
      const databaseErrorHandlers: Record<string, () => Response | null> = {
        '22P02': () => createErrorResponse(400, 'Invalid UUID format', res),
        '23503': () => createErrorResponse(400, 'Referenced resource not found', res),
        '23505': () => createErrorResponse(409, 'Resource already exists', res),
      }
      
      const handler = databaseErrorHandlers[errorCode]
      return handler ? handler() : null
    }
  },
  
  // Erros de sintaxe JSON
  {
    test: (error) => error instanceof SyntaxError && 'body' in error,
    handle: (_, res) => createErrorResponse(400, 'Invalid JSON format', res)
  },
  
  // Erros de validação (Yup/Joi)
  {
    test: (error) => error.name === 'ValidationError',
    handle: (error, res) => createErrorResponse(422, error.message, res)
  }
]

export default async function globalHandlingErrors(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Tentar encontrar um handler específico para o erro
  for (const { test, handle } of errorHandlers) {
    if (test(error)) {
      const response = handle(error, res)
      if (response) return response
    }
  }

  // Log do erro para debug
  console.error('Unhandled error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  })

  // Erro genérico
  return createErrorResponse(500, 'Internal server error', res)
}
