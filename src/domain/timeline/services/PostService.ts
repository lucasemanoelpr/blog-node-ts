import { inject, injectable } from "tsyringe";
import type IPostRepository from "../interfaces/IPostRepository";
import Post from "../entities/Post.entity";
import { tokens } from "#di/tokens";
import CommonService from "#shared/bases/CommonService";

@injectable()
export default class PostService extends CommonService<Post> {
    constructor(
        @inject(tokens.PostRepository)
        postRepository: IPostRepository
    ) {
        super(postRepository);
    }
}
