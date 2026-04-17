

import { Repository, EntityTarget, DeepPartial, ObjectLiteral } from "typeorm";
import AppDataSource from '#infrastructure/database/AppDataSource'
import ICommonRepository from '#shared/interfaces/ICommonRepository'

export default abstract class CommonRepository<T extends ObjectLiteral> implements ICommonRepository<T> {

    private repository: Repository<T>

    constructor(private readonly entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(this.entity)
    }
    
    protected getRepository(): Repository<T> {
        return this.repository;
    }

    public findAll(): Promise<T[]> {
        return this.repository.find();
    }
    
    public findOne(id: string | number): Promise<T | null> {
        return this.repository.findOne({ 
            where: { id: id as any } 
        });
    }
    
    public create(entity: DeepPartial<T>): Promise<T> {
        return this.repository.save(entity as any);
    }
    
    public update(id: string | number, entity: DeepPartial<T>): Promise<T | null> {
        return this.repository.update(id, entity as any).then(() => this.findOne(id));
    }
    
    public async delete(id: string | number): Promise<boolean> {
        const result = await this.repository.delete(id);
        return (result?.affected || 0) > 0;
    }
}
