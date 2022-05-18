import { Either, left, right } from "fp-ts/lib/Either";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";

export class Email {
    private static RULE = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    private constructor(readonly value: string) {}

    static create(value: string): Either<NonEmptyArray<string>, Email> {
        const parts = value.split("@");
        if (parts.length !== 2 || parts[0].length > 64 || parts[1].length > 255) {
            return left(["Invalid email."]);
        }

        const domainParts = parts[1].split(".");
        if (domainParts.some(d => d.length > 63)) {
            return left(["Invalid email."]);
        }

        if (!Email.RULE.test(value)) {
            return left(["Invalid email."]);
        }
        return right(new Email(value));
    }

    static of(value: string): Email {
        return new Email(value);
    }
}