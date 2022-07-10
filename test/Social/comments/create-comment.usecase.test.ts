import { mock } from "jest-mock-extended";
import { UID } from "../../../src/kernel/uid";
import { CreateCommentUsecase } from "../../../src/modules/Social/application/comments/create-comment/create-comment.usecase";
import { Comments } from "../../../src/modules/Social/domain/comments/comments";
import { InvalidComment } from "../../../src/modules/Social/domain/comments/errors";

describe("Create comment", () => {
    const comments = mock<Comments>();
    const mockId = UID.generate();
    const usecase = new CreateCommentUsecase(comments);

    beforeAll(() => {
        comments.save.mockResolvedValue();
    })

    it("should return void", async () => {
        await expect(usecase.execute({
            content: "some content",
            userId: mockId.value,
            publicationId: mockId.value
        }))
        .resolves
        .toBeUndefined();
    });

    it("should throw when the content is invalid", async () => {
        await expect(usecase.execute({
            content: "",
            userId: mockId.value,
            publicationId: mockId.value
        }))
        .rejects
        .toBeInstanceOf(InvalidComment);
    });

    it("should throw when an id is invalid", async () => {
        await expect(usecase.execute({
            content: "some content",
            userId: "",
            publicationId: mockId.value
        }))
        .rejects
        .toBeInstanceOf(InvalidComment);
    });

    it("should cumulate input errors", async () => {
        await expect(usecase.execute({
            content: "",
            userId: mockId.value,
            publicationId: ""
        }))
        .rejects
        .toHaveProperty("message", "Empty comment.\nInvalid publication id.");
    });
})