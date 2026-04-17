import { injectable } from "tsyringe";
import Post from "../entities/Post.entity";
import IPostRepository from "../interfaces/IPostRepository";

@injectable()
export default class PostRepository implements IPostRepository {
    
    private posts: Post[] = [];
    
    async getPost(id: number): Promise<Post | undefined> {
        return new Promise((resolve, reject) => {
            resolve(this.posts.find(p => p.id === id));
        });
    }

    async getPosts(): Promise<Post[]> {
        return new Promise((resolve, reject) => {
            resolve(this.posts);
        });
    }

    async addPost(post: Post): Promise<Post> {
        return new Promise((resolve, reject) => {
            this.posts.push(post);
            return resolve(post);
        });
    }

    async updatePost(id: number, post: Post): Promise<Post | undefined> {
        return new Promise((resolve, reject) => {
            const index = this.posts.findIndex(p => p.id === id);
            if (index >= 0) {
                this.posts[index] = post;
                return resolve(post);
            }
            return resolve(undefined);
        });
    }

    async deletePost(id: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const index = this.posts.findIndex(p => p.id === id);
            if (index >= 0) {
                this.posts.splice(index, 1);
                return resolve(true);
            }
            return resolve(false);
        });
    }
}
