
export abstract class UniqueId<T extends {}> {
    protected constructor(readonly value: T) {}

    abstract equals(other: object): boolean;
}