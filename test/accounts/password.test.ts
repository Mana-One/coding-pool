import { isLeft, isRight } from "fp-ts/lib/Either";
import { Password } from "../../src/modules/UserAccess/domain/password";

describe("Password", () => {
    const basePassword = "azertyUIOP1213";

    describe("creation", () => {
        it("should return a Password instance", () => {
            const result = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(result)) {
                expect(result.right).toBeInstanceOf(Password);
            }
        });

        it("should return a Password instance that is not hashed", () => {
            const result = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(result)) {
                expect(result.right.isHashed).toBe(false);
            }
        });
    
        it("should return an error when the value has less than 8 characters", () => {
            const result = Password.fromClear("aZ123");
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left[0]).toBe("Password needs at least 8 characters.");
            }
        });
    
        it("should return an error when the value has more than 32 characters", () => {
            const result = Password.fromClear(basePassword.padEnd(33, "aZ3"));
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left[0]).toBe("Password needs at most 32 characters");
            }
        });
    
        it("should return an error when the value is missing a lowercase character", () => {
            const result = Password.fromClear("AZERTYUIOP123");
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left[0]).toBe("Password needs at least 1 lowercase character");
            }
        });
    
        it("should return an error when the value is missing an uppercase character", () => {
            const result = Password.fromClear("azertyuiop123");
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left[0]).toBe("Password needs at least 1 uppercase character");
            }
        });
    
        it("should return an error when the value is missing a number", () => {
            const result = Password.fromClear("azertyUIOP+=/");
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left[0]).toBe("Password needs at least 1 number");
            }
        });
    
        it("should cumulate errors", () => {
            const result = Password.fromClear("azerty");
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left.length).toBeGreaterThan(0);
            }
        });
    });

    describe("hash", () => {
        it("should hash the stored value", async () => {
            const base = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(base)) {
                const hashed = await base.right.hash();
                expect(hashed.isHashed).toBe(true);
            }
        });

        it("should generate a new instance", async () => {
            const base = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(base)) {
                const hashed = await base.right.hash();
                expect(hashed).not.toBe(base.right);
            }
        });
    });

    describe("comparison", () => {
        it("should match the clear value when the password is not hashed", async () => {
            const base = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(base)) {
                const result = await base.right.compareWithClear(basePassword);
                expect(result).toBe(true);
            }
        });

        it("should match the clear value when the password is hashed", async () => {
            const base = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(base)) {
                const hashed = await base.right.hash();
                const result = await hashed.compareWithClear(basePassword);
                expect(result).toBe(true);
            }
        });

        it("should not match the clear value when the password is not hashed", async () => {
            const base = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(base)) {
                const result = await base.right.compareWithClear(basePassword + "hey");
                expect(result).toBe(false);
            }
        });

        it("should not match the clear value when the password is hashed", async () => {
            const base = Password.fromClear(basePassword);
            expect.hasAssertions();
            if (isRight(base)) {
                const hashed = await base.right.hash();
                const result = await hashed.compareWithClear(basePassword + "hey");
                expect(result).toBe(false);
            }
        });
    });
});