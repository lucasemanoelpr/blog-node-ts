import { inject, injectable } from "tsyringe";
import User from "../entities/User.entity";
import { tokens } from "#di/tokens";
import CommonService from "#shared/bases/CommonService";
import type ICommonRepository from "#shared/interfaces/ICommonRepository";
import type IUserService from "../interfaces/IUserService";
import bcryptjs from "bcryptjs";
import ICreateUser from "../interfaces/ICreateUser";

@injectable()
export default class UserService extends CommonService<User> implements IUserService {
    constructor(
        @inject(tokens.UserRepository)
        userRepository: ICommonRepository<User>
    ) {
        super(userRepository);
    }

    async register(user: ICreateUser): Promise<boolean> {
        user.password = await bcryptjs.hash(user.password, 10);
        return (await this.create(user)) !== null;
    }
}
