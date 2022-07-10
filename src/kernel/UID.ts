import { Either, left, right } from "fp-ts/lib/Either";
import { NonEmptyArray, of } from "fp-ts/lib/NonEmptyArray";
import { v1, validate } from "uuid";
import { UniqueId } from "./unique-id";

export class UID extends UniqueId<string> {
    override equals(other: object): boolean {
        if (other == null || !(other instanceof UID)) {
            return false;
        }
        return this === other || this.value === other.value;
    }

    static generate(): UID {
        return new UID(v1());
    }

    static of(id: string): UID {
        return new UID(id);
    }

    static fromString(id: string, err: string): Either<NonEmptyArray<string>, UID> {
        return validate(id) ? right(new UID(id)) : left(of(err));
    }
}