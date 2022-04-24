import { Inject, Injectable } from "@nestjs/common";
import { isLeft } from "fp-ts/lib/Either";
import { Usecase } from "../../../../kernel/Usecase";
import { PROGRAMS } from "../../constants";
import { InvalidProgram } from "../errors";
import { Program } from "../../domain/program";
import { Programs } from "../../domain/programs";
import { CreateProgramCommand } from "./create-program.command";

@Injectable()
export class CreateProgramUsecase implements Usecase<CreateProgramCommand, void> {
    constructor(@Inject(PROGRAMS) private readonly programs: Programs) {}

    async execute(request: CreateProgramCommand): Promise<void> {
        const program = Program.create(request);
        if (isLeft(program)) {
            throw InvalidProgram.fromMessages(program.left);
        }
        await this.programs.save(program.right);
    }
}