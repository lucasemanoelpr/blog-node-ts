import { inject, injectable } from "tsyringe";
import jwt from 'jsonwebtoken'
import User from '#domain/user/entities/User.entity'
import { tokens } from "#di/tokens";
import type IConfiguration from "#shared/interfaces/IConfiguration";
import type ITokenService from "#domain/authentication/interfaces/ITokenService";

@injectable()
export default class TokenService implements ITokenService {
    constructor(
        @inject(tokens.Config)
        private config: IConfiguration
    ) { }

    generateToken(user: User): string {
        const token_key = this.config.get().tokenKey
    
        if (!token_key) {
            throw new Error('TOKEN_KEY was not defined in .env')
        }
    
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                created_at: user.created_at,
            },
            token_key,
            {
            expiresIn: '2h',
            }
        )
        
        return token
    }
}