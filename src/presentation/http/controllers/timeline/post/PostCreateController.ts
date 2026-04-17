import { inject, injectable } from "tsyringe";
import { tokens } from "#di/tokens";
import { Request, Response } from 'express'
import BaseController from "../../BaseController";
import IController from "#shared/interfaces/IController";
import type ICrudService from "#shared/interfaces/ICrudService";
import Post from "#domain/timeline/entities/Post.entity";

@injectable()
export default class PostCreateController extends BaseController implements IController {
    constructor(
        @inject(tokens.PostService)
        private postService: ICrudService<Post>
    ) {
        super();
    }
    
    async handle(req: Request, res: Response): Promise<Response> {
        const post = await this.postService.create(req.body);
        return this.success(res, 'Post created successfully', post);
    }
}
