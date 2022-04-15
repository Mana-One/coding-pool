import * as bcrypt from "bcrypt";
import { sequenceT } from "fp-ts/lib/Apply";
import { Either, map } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { cumulativeValidation } from "../../../kernel/FpUtils";
import { matchRule, maxLength, minLength } from "../../../kernel/StringUtils";

export class Password {
    private constructor(
        readonly isHashed: boolean,
        readonly value: string
    ) {}

    async hash(): Promise<Password> {
        if (this.isHashed) {
            return this;
        }
        return new Password(true, await bcrypt.hash(this.value, 10));
    }

    async compareWithClear(clear: string): Promise<boolean> {
        if (!this.isHashed) {
            return this.value === clear;
        }
        return bcrypt.compare(clear, this.value);
    }

    static fromClear(value: string): Either<NonEmptyArray<string>, Password> {
        return pipe(
            sequenceT(cumulativeValidation)(
                minLength(8, "Password needs at least 8 characters.")(value),
                maxLength(32, "Password needs at most 32 characters")(value),
                matchRule(/[A-Z]/g, "Password needs at least 1 uppercase character")(value),
                matchRule(/[a-z]/g, "Password needs at least 1 lowercase character")(value),
                matchRule(/[0-9]/g, "Password needs at least 1 number")(value)
            ),
            map(() => new Password(false, value))
        );
    }

    static of(hashed: string): Password {
        return new Password(true, hashed);
    }
}