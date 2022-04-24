import { isLeft, isRight } from "fp-ts/lib/Either";
import { UID } from "../../src/kernel/UID";
import { Program } from "../../src/modules/Programs/domain/program";

describe("Program", () => {
    const authorId = UID.generate();

    describe("static create", () => {
        it("should insstantiate a Program", () => {
            const result = Program.create({ authorId: authorId.value });
            expect.hasAssertions();
            if (isRight(result)) {
                expect(result.right).toBeInstanceOf(Program);
                expect(result.right.content).toHaveLength(0);
            }
        })

        it("should return errors when the author id is invalid", () => {
            const result = Program.create({ authorId: "" });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })
    })

    describe("replaceContent", () => {
        let program: Program;

        beforeEach(() => {
            program = Program.of({
                id: UID.generate(),
                content: "some content",
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