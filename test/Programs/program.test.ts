import { isLeft, isRight } from "fp-ts/lib/Either";
import { UID } from "../../src/kernel/UID";
import { Program } from "../../src/modules/Programs/domain/program";

describe("Program", () => {
    const authorId = UID.generate();

    describe("static create", () => {
        it("should instantiate a Program", () => {
            const result = Program.create({ title: "My program", authorId: authorId.value, languageId: 17 });
            expect.hasAssertions();
            if (isRight(result)) {
                expect(result.right).toBeInstanceOf(Program);
                expect(result.right.languageId).toBe(17);
                expect(result.right.content).toHaveLength(0);
                expect(result.right.authorId.equals(authorId)).toBe(true);
            }
        })

        it("should return an error when the title is too short", () => {
            const result = Program.create({ title: "", authorId: authorId.value, languageId: 17 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should return an error when the title is too long", () => {
            const result = Program.create({ title: "MyProgram".padEnd(101, "to"), authorId: authorId.value, languageId: 17 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should return an error when the author id is invalid", () => {
            const result = Program.create({ title: "My program", authorId: "", languageId: 17 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should return an error when the language id is negative", () => {
            const result = Program.create({ title: "My program", authorId: authorId.value, languageId: -17 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should return an error when the language id not an integer", () => {
            const result = Program.create({ title: "My program", authorId: authorId.value, languageId: 3.2 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(1);
            }
        })

        it("should cumulate errors", () => {
            const result = Program.create({ title: "My program", authorId: "", languageId: 3.2 });
            expect.hasAssertions();
            if (isLeft(result)) {
                expect(result.left).toHaveLength(2);
            }
        })
    })

    describe("modifications", () => {
        let program: Program;
    
        beforeEach(() => {
            program = Program.of({
                id: UID.generate(),
                title: "My program",
                content: "some content",
                languageId: 17,
                authorId
            });
        })

        describe("replaceContent", () => {
            it("should return Right<void>", () => {
                const result = program.replaceContent("another content");
                expect.hasAssertions();
                if(isRight(result)) {
                    expect(result.right).toBeUndefined();
                    expect(program.content).toBe("another content");
                }
            })
    
            it("should return Right<void> when the new content is empty", () => {
                const result = program.replaceContent("");
                expect.hasAssertions();
                if(isRight(result)) {
                    expect(result.right).toBeUndefined();
                    expect(program.content).toBe("");
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
    
        describe("replaceTitle", () => {
            it("should return Right<void>", () => {
                const result = program.replaceTitle("My new Program");
                expect.hasAssertions();
                if(isRight(result)) {
                    expect(result.right).toBeUndefined();
                    expect(program.title).toBe("My new Program");
                }
            })
    
            it("should return Left<NonEmptyArray<string>> the new title is empty", () => {
                const result = program.replaceTitle("");
                expect.hasAssertions();
                if(isLeft(result)) {
                    expect(result.left).toHaveLength(1);
                }
            })
    
            it("should return Left<NonEmptyArray<string>> when the new title is too long", () => {
                const result = program.replaceTitle("My new Program".padEnd(101, "to"));
                expect.hasAssertions();
                if(isLeft(result)) {
                    expect(result.left).toHaveLength(1);
                }
            })
        })  
    })
})