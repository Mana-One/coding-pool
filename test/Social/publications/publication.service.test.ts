import { mock } from "jest-mock-extended";
import { UID } from "../../../src/kernel/UID";
import { InvalidPublication } from "../../../src/modules/Social/publications/errors";
import { PublicationService } from "../../../src/modules/Social/publications/publication.service";
import { Publications } from "../../../src/modules/Social/publications/publications";

describe("Publication service", () => {
    const publications = mock<Publications>();
    const mockId = UID.generate();
    const service = new PublicationService(publications);

    beforeAll(() => {
        publications.save.mockResolvedValue();
    });

    describe("create", () => {
        it("should return void", async () => {
            const command = {
                content: "Some content",
                postedBy: mockId.value
            };

            await expect(service.create(command))
                .resolves
                .toBeUndefined();
        });

        it("should throw when the content is empty", async () => {
            const command = {
                content: "",
                postedBy: mockId.value
            };

            await expect(service.create(command))
                .rejects
                .toBeInstanceOf(InvalidPublication);
        });

        it("should throw when the postedBy is invalid", async () => {
            const command = {
                content: "Some content",
                postedBy: ""
            };

            await expect(service.create(command))
                .rejects
                .toBeInstanceOf(InvalidPublication);
        });

        it("should cumulate errors", async () => {
            const command = {
                content: "",
                postedBy: ""
            };

            await expect(service.create(command))
                .rejects
                .toHaveProperty("message", "Empty publication.\nInvalid user id.");
        });
    });
});