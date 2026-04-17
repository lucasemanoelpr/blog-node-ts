import { DeepPartial } from "typeorm";
import ICommonRepository from '#shared/interfaces/ICommonRepository';
import ICommonService from '#shared/interfaces/ICommonService';

export default abstract class CommonService<T> implements ICommonService<T> {
    
    constructor(protected repository: ICommonRepository<T>) {}

    public find(): Promise<T[]> {
        return this.repository.findAll();
    }
    
    public findOne(id: string | number): Promise<T | null> {
        return this.repository.findOne(id);
    }
    
    public create(entity: DeepPartial<T>): Promise<T> {
        return this.repository.create(entity);
    }
    
    public update(id: string | number, entity: DeepPartial<T>): Promise<T | null> {
        return this.repository.update(id, entity);
    }
    
    public delete(id: string | number): Promise<boolean> {
        return this.repository.delete(id);
    }
}
