import { inject, injectable } from "tsyringe";
import { tokens } from "#di/tokens";
import { Request, Response } from 'express'
import BaseController from "../../BaseController";
import IController from "#shared/interfaces/IController";
import type ICommonService from "#shared/interfaces/ICommonService";
import Post from "#domain/timeline/entities/Post.entity";

@injectable()
export default class PostUpdateController extends BaseController implements IController {
    constructor(
        @inject(tokens.PostService)
        private postService: ICommonService<Post>
    ) {
        super();
    }
    
    async handle(req: Request, res: Response): Promise<Response> {
        const post = await this.postService.update(req.params.id as string, req.body);
        return this.success(res, 'Post updated successfully', post);
    }
}
