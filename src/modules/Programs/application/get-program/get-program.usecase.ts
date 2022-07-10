import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Usecase } from "../../../../kernel/usecase";
import { ProgramModel } from "../../infrastructure/program.model";
import { GetProgramQuery } from "./get-program.query";
import { ProgramDto } from "./program.dto";

@Injectable()
export class GetProgramUsecase implements Usecase<GetProgramQuery, ProgramDto> {
    async execute(request: GetProgramQuery): Promise<ProgramDto> {
        const instance = await ProgramModel.findByPk(request.id)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
        if (instance === null) {
            throw new NotFoundException(`Program not found with id '${request.id}' not found.`);
        }
        return this.toDto(instance);
    }

    private toDto(instance: ProgramModel): ProgramDto {
        return {
            id: instance.id,
            title: instance.title,
            content: instance.content,
            languageId: instance.languageId,
            authorId: instance.authorId
        };
    }
}