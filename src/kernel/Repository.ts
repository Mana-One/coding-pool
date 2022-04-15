import { Option } from "fp-ts/lib/Option";

export interface Repository<VOID, TEntity> {
    findById(id: VOID): Promise<Option<TEntity>>;
    save(entity: TEntity): Promise<void>;
}