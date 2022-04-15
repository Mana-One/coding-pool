import { UniqueId } from "./UniqueId";

export abstract class Entity<VOID extends UniqueId<{}>, TProps extends {}> {
    protected constructor(readonly id: VOID, protected props: TProps) {}

    equals(other: object): boolean {
        if (other == null ||!(other instanceof Entity)) {
            return false;
        }
        return this === other || this.id.equals(other.id);
    }
}