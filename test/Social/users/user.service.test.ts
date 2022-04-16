import { mock } from "jest-mock-extended";
import { execPath } from "process";
import { UID } from "../../../src/kernel/UID";
import { InvalidUser } from "../../../src/modules/Social/users/errors";
import { UserService } from "../../../src/modules/Social/users/user.service";
import { Users } from "../../../src/modules/Social/users/users";

describe("User service", () => {
    const users = mock<Users>();
    const mockId = UID.generate();
    const service = new UserService(users);

    beforeAll(() => {
        users.save.mockResolvedValue();
    });

    describe("create", () => {
        it("should return void", async () => {
            await expect(service.create({ id: mockId.value, username: "username" }))
                .resolves
                .toBeUndefined();
        });

        it("should throw when the id is invalid", async () => {
            await expect(service.create({ id: "invalid id", username: "username" }))
                .rejects
                .toBeInstanceOf(InvalidUser);
        });

        it("should throw when the username is invalid", async () => {
            await expect(service.create({ id: mockId.value, username: "" }))
                .rejects
                .toBeInstanceOf(InvalidUser);
        });

        it("should cumulate errors", async () => {
            await expect(service.create({ id: "invalid id", username: "" }))
                .rejects
                .toHaveProperty("message", "Invalid user id.\nEmpty username.");
        });
    });
});