import dotenv from 'dotenv'
import { injectable } from 'tsyringe'

/**
 * A simple application configuration interface.
 */
export interface Configuration {
  // HTTP port when running application
  port: number

  serviceName: string
  environment: string
  instance?: string

  logging: {
    enabled: boolean
    queueURL: string
  }

  docs: {
    enabled: boolean
  }

  tokenKey: string

  sessionSecret: string
}

/**
 * A simple injectable Config class, with a single `get` method that returns
 * the entire config.
 */
@injectable()
export class Config {
  private readonly config: Configuration

  constructor() {
    this.config = this.getConfigFromEnv()
  }

  public get() {
    return this.config
  }

  private getConfigFromEnv(): Configuration {
    dotenv.config()

    return {
      serviceName: process.env.SERVICE_NAME || 'no-name',
      environment: process.env.NODE_ENV || 'development',

      logging: {
        enabled: process.env.LOGGING_ENABLED === 'true',
        queueURL: process.env.LOGGING_QUEUE_URL || '',
      },

      docs: {
        enabled: process.env.DOCS_ENABLED === 'true',
      },

      port: Number(process.env.PORT) || 80,

      tokenKey: process.env.TOKEN_KEY || '',

      sessionSecret: process.env.SESSION_SECRET || '',
    }
  }
}
