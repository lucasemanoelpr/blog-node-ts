import { injectable } from "tsyringe";
import User from "../entities/User.entity";
import CommonRepository from "#shared/bases/CommonRepository";

@injectable()
export default class UserRepository extends CommonRepository<User> {
   constructor() {
      super(User);
   }   
}
