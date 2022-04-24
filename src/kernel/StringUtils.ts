import { Either, left, right } from "fp-ts/lib/Either";
import { NonEmptyArray, of } from "fp-ts/lib/NonEmptyArray";

type StringResult = Either<NonEmptyArray<string>, string>;

export module StringUtils {
    export const minLength = (minLength: number, err: string) => (s: string): StringResult => {
        return s.length >= minLength ? right(s) : left(of(err));
    }
    
    export const maxLength = (maxLength: number, err: string) => (s: string): StringResult => {
        return s.length <= maxLength ? right(s) : left(of(err));
    }

    export const lengthBetween = (minLength: number, maxLength: number, err: string) => (s: string): StringResult => {
        return (minLength <= s.length && s.length <= maxLength) ? 
            right(s) :
            left(of(err));
    }
    
    export const matchRule = (rule: RegExp, err: string) => (s: string): StringResult => {
        return rule.test(s) ? right(s) : left(of(err));
    }
}