import Post from "../entities/Post.entity";
import ICommonRepository from "#shared/interfaces/ICommonRepository";

export default interface IPostRepository extends ICommonRepository<Post> {
    getPost(id: number): Promise<Post | undefined>;
    getPosts(): Promise<Post[]>;
    addPost(post: Post): Promise<Post>;
    updatePost(id: number, post: Post): Promise<Post | undefined>;
    deletePost(id: number): Promise<boolean>;
}