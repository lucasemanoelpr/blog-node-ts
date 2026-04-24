import User from "#domain/user/entities/User.entity";

export default interface ITokenService {
    generateToken(user: User): string
    generateHashedToken(token: string): Promise<string>
}