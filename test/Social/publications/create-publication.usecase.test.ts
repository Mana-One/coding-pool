import { mock } from "jest-mock-extended"
import { UID } from "../../../src/kernel/UID";
import { CreatePublicationUsecase } from "../../../src/modules/Social/application/publications/create-publication/create-publication.usecase";
import { InvalidPublication } from "../../../src/modules/Social/domain/publications/errors";
import { Publications } from "../../../src/modules/Social/domain/publications/publications"

describe("Create publication", () => {
    const publications = mock<Publications>();
    const mockId = UID.generate();
    const usecase = new CreatePublicationUsecase(publications);

    beforeAll(() => {
        publications.save.mockResolvedValue();
    })

    it("should return void", async () => {
        const command = {
            content: "Some content",
            postedBy: mockId.value
        };

        await expect(usecase.execute(command))
            .resolves
            .toBeUndefined();
    });

    it("should throw when the content is empty", async () => {
        const command = {
            content: "",
            postedBy: mockId.value
        };

        await expect(usecase.execute(command))
            .rejects
            .toBeInstanceOf(InvalidPublication);
    });

    it("should throw when the postedBy is invalid", async () => {
        const command = {
            content: "Some content",
            postedBy: ""
        };

        await expect(usecase.execute(command))
            .rejects
            .toBeInstanceOf(InvalidPublication);
    });

    it("should cumulate errors", async () => {
        const command = {
            content: "",
            postedBy: ""
        };

        await expect(usecase.execute(command))
            .rejects
            .toHaveProperty("message", "Empty publication.\nInvalid user id.");
    });
})