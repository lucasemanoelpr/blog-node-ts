import type ICommonService from "#shared/interfaces/ICommonService";
import User from "../entities/User.entity";
import ICreateUser from "./ICreateUser";

export default interface IUserService extends ICommonService<User> {    
    register(user: ICreateUser): Promise<boolean>;
}