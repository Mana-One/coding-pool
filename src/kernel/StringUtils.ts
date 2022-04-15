import { Either, left, right } from "fp-ts/lib/Either";
import { NonEmptyArray, of } from "fp-ts/lib/NonEmptyArray";

export module StringUtils {
    export const minLength = (minLength: number, err: string) => (s: string): Either<NonEmptyArray<string>, string> => {
        return s.length >= minLength ? right(s) : left(of(err));
    }
    
    export const maxLength = (maxLength: number, err: string) => (s: string): Either<NonEmptyArray<string>, string> => {
        return s.length <= maxLength ? right(s) : left(of(err));
    }
    
    export const matchRule = (rule: RegExp, err: string) => (s: string): Either<NonEmptyArray<string>, string> => {
        return rule.test(s) ? right(s) : left(of(err));
    }
}