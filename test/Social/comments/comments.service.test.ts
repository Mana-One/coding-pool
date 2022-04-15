import { mock } from "jest-mock-extended";
import { UID } from "../../../src/kernel/UID";
import { Comments } from "../../../src/usecases/Social/comments/comments";
import { CommentsService } from "../../../src/usecases/Social/comments/comments.service";
import { InvalidComment } from "../../../src/usecases/Social/comments/errors";

describe("Comments service", () => {
    const comments = mock<Comments>();
    const mockId = UID.generate();
    const service = new CommentsService(comments);

    beforeAll(() => {
        comments.removeBy.mockResolvedValue();
        comments.save.mockResolvedValue();
    });

    describe("create", () => {
        it("should return void", async () => {
            await expect(service.create({
                content: "some content",
                userId: mockId.value,
                publicationId: mockId.value
            }))
            .resolves
            .toBeUndefined();
        });

        it("should throw when the content is invalid", async () => {
            await expect(service.create({
                content: "",
                userId: mockId.value,
                publicationId: mockId.value
            }))
            .rejects
            .toBeInstanceOf(InvalidComment);
        });

        it("should throw when an id is invalid", async () => {
            await expect(service.create({
                content: "some content",
                userId: "",
                publicationId: mockId.value
            }))
            .rejects
            .toBeInstanceOf(InvalidComment);
        });

        it("should cumulate input errors", async () => {
            await expect(service.create({
                content: "",
                userId: mockId.value,
                publicationId: ""
            }))
            .rejects
            .toHaveProperty("message", "Empty comment.\nInvalid publication id.");
        });
    });
});