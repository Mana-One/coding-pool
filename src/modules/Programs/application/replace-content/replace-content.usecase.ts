import { Inject, Injectable } from "@nestjs/common";
import { sequenceS } from "fp-ts/lib/Apply";
import { isLeft } from "fp-ts/lib/Either";
import { pipe } from "fp-ts/lib/function";
import { isNone } from "fp-ts/lib/Option";
import { cumulativeValidation } from "../../../../kernel/FpUtils";
import { UID } from "../../../../kernel/UID";
import { Usecase } from "../../../../kernel/Usecase";
import { PROGRAMS } from "../../constants";
import { Program } from "../../domain/program";
import { Programs } from "../../domain/programs";
import { InvalidProgram, ProgramNotFound } from "../errors";
import { ReplaceContentCommand } from "./replace-content.command";

@Injectable()
export class ReplaceContentUsecase implements Usecase<ReplaceContentCommand, void> {
    constructor(@Inject(PROGRAMS) private readonly programs: Programs) {}

    async execute(request: ReplaceContentCommand): Promise<void> {
        const { id, callerId } = this.validateRequest(request);
        const program = await this.fetchProgram(id, callerId);
        
        program.replaceContent(request.content);
        await this.programs.save(program);
    }

    private validateRequest(request: ReplaceContentCommand) {
        const check = pipe(
            sequenceS(cumulativeValidation)({
                id: UID.fromString(request.id, "Invalid program id."),
                callerId: UID.fromString(request.callerId, "Invalid author id.")
            })
        );
        if (isLeft(check)) {
            throw InvalidProgram.fromMessages(check.left)
        }

        return check.right;
    }

    private async fetchProgram(id: UID, authorId: UID): Promise<Program> {
        const program = await this.programs.findByIdAndAuthor(id, authorId);
        if (isNone(program)) {
            throw ProgramNotFound.withIdAndAuthor(id, authorId);
        }
        return program.value;
    }
}