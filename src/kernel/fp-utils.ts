import { getApplicativeValidation } from "fp-ts/lib/Either";
import { getSemigroup } from "fp-ts/lib/NonEmptyArray";

export const cumulativeValidation = getApplicativeValidation(getSemigroup<string>());