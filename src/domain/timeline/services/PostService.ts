import { inject, injectable } from "tsyringe";
import type IPostRepository from "../interfaces/IPostRepository";
import Post from "../entities/Post.entity";
import { tokens } from "#di/tokens";
import ICrudService from "#shared/interfaces/ICrudService";

@injectable()
export default class PostService implements ICrudService<Post> {
    constructor(
        @inject(tokens.PostRepository)
        private postRepository: IPostRepository
    ) {}

    async find(): Promise<Post[]> {
        return this.postRepository.getPosts();
    }

    async findOne(id: number): Promise<Post | undefined> {
        return this.postRepository.getPost(id);
    }

    async create(post: Post): Promise<Post> {
        return this.postRepository.addPost(post);
    }

    async update(id: number, post: Post): Promise<Post | undefined> {
        return this.postRepository.updatePost(id, post);
    }

    async delete(id: number): Promise<boolean> {
        return this.postRepository.deletePost(id);
    }
}
