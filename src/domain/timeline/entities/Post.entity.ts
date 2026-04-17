export default class Post {
    id: number;
    title: string;
    content: string;
    
    private static nextId = 1;

    constructor(title: string, content: string) {
        this.id = Post.nextId++;
        this.title = title;
        this.content = content;
    }
}
