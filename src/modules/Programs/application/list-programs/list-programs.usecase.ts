import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { Usecase } from "../../../../kernel/Usecase";
import { ProgramModel } from "../../infrastructure/program.model";
import { ListProgramsQuery } from "./list-programs.query";
import { Portfolio, SingleProgramDto } from "./portfolio";

@Injectable()
export class ListProgramsUsecase implements Usecase<ListProgramsQuery, Portfolio> {
    async execute(request: ListProgramsQuery): Promise<Portfolio> {
        const { rows, count } = await ProgramModel.findAndCountAll({
            where: { authorId: request.authorId },
            order: [["createdAt", "DESC"]],
            limit: request.limit,
            offset: request.offset
        })
        .catch(err => { throw new InternalServerErrorException(String(err)); });
        return new Portfolio(rows.map(this.toDto), count, request.limit, request.offset);
    }

    private toDto(instance: ProgramModel): SingleProgramDto {
        return {
            id: instance.id,
            title: instance.title,
            createdAt: instance.createdAt
        };
    }
}