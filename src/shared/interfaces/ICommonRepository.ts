import { DeepPartial, Repository, ObjectLiteral } from "typeorm";

export default interface ICommonRepository<T extends ObjectLiteral> {
    findAll(): Promise<T[]>;
    findOne(id: string | number): Promise<T | null>;
    findOneBy(filter: Partial<T>): Promise<T | null>;
    create(entity: DeepPartial<T>): Promise<T>;
    update(id: string | number, entity: DeepPartial<T>): Promise<T | null>;
    delete(id: string | number): Promise<boolean>;
    getRepository(): Repository<T>;
}
