import { DeepPartial, ObjectLiteral } from "typeorm";

export default interface ICommonService<T extends ObjectLiteral> {
    find(): Promise<T[]>;
    findOne(id: string | number): Promise<T | null>;
    findOneBy(filter: Partial<T>): Promise<T | null>;
    create(entity: DeepPartial<T>): Promise<T>;
    update(id: string | number, entity: DeepPartial<T>): Promise<T | null>;
    delete(id: string | number): Promise<boolean>;
}