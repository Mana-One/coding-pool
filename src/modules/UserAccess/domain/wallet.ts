import { Either, left, right } from "fp-ts/lib/Either";
import { NonEmptyArray, of } from "fp-ts/lib/NonEmptyArray";
import { isAddress } from "web3-utils";

export class Wallet {
    private constructor(readonly value: string) {}

    static fromString(value: string): Either<NonEmptyArray<string>, Wallet>{
        return isAddress(value) ?
            right(new Wallet(value)) :
            left(of("Invalid wallet address."));
    }

    static of(value: string): Wallet {
        return new Wallet(value);
    }
}