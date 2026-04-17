import { injectable } from "tsyringe";
import Post from "../entities/Post.entity";
import CommonRepository from "#shared/bases/CommonRepository";

@injectable()
export default class PostRepository extends CommonRepository<Post> {
   constructor() {
      super(Post);
   }   
}
