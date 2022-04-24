import { isLeft, isRight } from "fp-ts/lib/Either";
import { UID } from "../../src/kernel/UID";
import { Program } from "../../src/modules/Programs/domain/program";

describe("Program", () => {
    const authorId = UID.generate();

    describe("static create", () => {
        it("should instantiate a Program", () => {
            const result = Program.create({ authorId: authorId.value, languageId: 17 });
            expect.hasAssertions();
            if (isRight(result)) {
                expect(result.right).toBeInstanceOf(Program);
                expect(result.right.languageId).toBe(17);
                expect(result.right.content).toHaveLength(0);
                expect(result.right.authorId.equals(authorId)).toBe(true);
            }
        })

        it("should return an error when the author id is invalid", () => {
            const result = Program.create({ authorId: "", languageId: 17 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should return an error when the language id is negative", () => {
            const result = Program.create({ authorId: authorId.value, languageId: -17 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should return an error when the language id not an integer", () => {
            const result = Program.create({ authorId: authorId.value, languageId: 3.2 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should cumulate errors", () => {
            const result = Program.create({ authorId: "", languageId: 3.2 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(2);
            }
        })
    })

    describe("replaceContent", () => {
        let program: Program;

        beforeEach(() => {
            program = Program.of({
                id: UID.generate(),
                content: "some content",
                languageId: 17,
                authorId
            });
        })

        it("should return Right<void>", () => {
            const result = program.replaceContent("another content");
            expect.hasAssertions();
            if(isRight(result)) {
                expect(result.right).toBeUndefined();
            }
        })

        it("should return Right<void> when the new content is empty", () => {
            const result = program.replaceContent("");
            expect.hasAssertions();
            if(isRight(result)) {
                expect(result.right).toBeUndefined();
            }
        })

        it("should return Left<NonEmptyArray<string>> when the content is too long", () => {
            const result = program.replaceContent("another content".padEnd(50_001, "to"));
            expect.hasAssertions();
            if(isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })
    })
})