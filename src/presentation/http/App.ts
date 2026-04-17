import dotenv from 'dotenv';
dotenv.config();

import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'
import { tokens } from '#di/tokens'

import { inject, injectable } from 'tsyringe'
import { Routes } from './Routes'

import globalHandlingErrors from './middlewares/GlobalHandlingErrors'

@injectable()
export class App {
  public server: Express
  constructor(
    @inject(tokens.Routes)
    private routes: Routes
  ) {
    this.server = express()

    this.server.use(morgan('tiny'))
    this.server.use(cors())
    this.server.use(helmet())
    this.server.use(express.json())


    this.setupRoutes()
    this.setupErrors()
  }

  public getServer() {
    return this.server
  }

  private setupRoutes() {
    this.server.use(this.routes.setupRouter())
  }

  private setupErrors() {
    this.server.use(globalHandlingErrors)
  }
  /**
   * Listens to specified port and starts the application.
   */
  public listen() {
    const port = parseInt(`${process.env.PORT || 3000}`)
    console.log(`Starting appplication on port ${port}`)

    this.server.listen(port)

    return this
  }
}
