import { DeepPartial } from "typeorm";

export default interface ICommonRepository<T> {
    findAll(): Promise<T[]>;
    findOne(id: string | number): Promise<T | null>;
    create(entity: DeepPartial<T>): Promise<T>;
    update(id: string | number, entity: DeepPartial<T>): Promise<T | null>;
    delete(id: string | number): Promise<boolean>;
}
