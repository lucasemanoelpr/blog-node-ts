import Post from "../entities/Post.entity";

export default interface IPostRepository {
    getPost(id: number): Promise<Post | undefined>;
    getPosts(): Promise<Post[]>;
    addPost(post: Post): Promise<Post>;
    updatePost(id: number, post: Post): Promise<Post | undefined>;
    deletePost(id: number): Promise<boolean>;
}