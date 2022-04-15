import { isLeft, isRight } from "fp-ts/lib/Either";
import { Wallet } from "../../src/usecases/accounts/domain/wallet";

describe("Wallet", () => {
    const baseWallet = "0xdc7f16D6F6A57fA52AA4Fa590D8F071B77B89aD6"

    describe("creation", () => {
        it("should return a Wallet", () => {
            const result = Wallet.fromString(baseWallet);
            expect.hasAssertions();
            if (isRight(result)) {
                expect(result.right).toBeInstanceOf(Wallet);
            }
        });

        it("should return errors", () => {
            const result = Wallet.fromString("fake wallet");
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left[0]).toBe("Invalid wallet address.");
            }
        })
    });
});