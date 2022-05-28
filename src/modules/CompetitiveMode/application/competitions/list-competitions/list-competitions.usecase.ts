import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { Op } from "sequelize";
import { Usecase } from "../../../../../kernel/Usecase";
import { CompetitionModel } from "../../../infrastructure/competitions/competition.model";
import { CompetitionList } from "./competition-list";
import { CompetitionDto } from "./competition.dto";
import { ListCompetitionsQuery } from "./list-competitions.query";

export class ListCompetitonsUsecase implements Usecase<ListCompetitionsQuery, CompetitionList> {
    async execute(request: ListCompetitionsQuery): Promise<CompetitionList> {
        switch(request.status) {
            case "scheduled":
                return this.listCurrentCompetitions(request);
            case "current":
                return this.listFutureCompetitions(request);
            case "ended":
                return this.listPastCompetitions(request);
            default:
                throw new BadRequestException("Invalid competition status.");
        }
    }

    private async listFutureCompetitions(request: ListCompetitionsQuery): Promise<CompetitionList> {
        return await CompetitionModel.findAndCountAll({
            attributes: ["id", "title", "startDate", "endDate"],
            where: { startDate: { [Op.gt]: Date.now() }},
            limit: request.limit,
            offset: request.offset
        })
        .then(res => new CompetitionList(res.rows.map(this.toDto), res.count, request.limit, request.offset))
        .catch(err => { throw new InternalServerErrorException(String(err)); });
    }

    private async listCurrentCompetitions(request: ListCompetitionsQuery): Promise<CompetitionList> {
        const now = Date.now();
        return await CompetitionModel.findAndCountAll({
            attributes: ["id", "title", "startDate", "endDate"],
            where: { 
                startDate: { [Op.lte]: now },
                endDate: { [Op.gte]: now }
            },
            limit: request.limit,
            offset: request.offset
        })
        .then(res => new CompetitionList(res.rows.map(this.toDto), res.count, request.limit, request.offset))
        .catch(err => { throw new InternalServerErrorException(String(err)); });
    }

    private async listPastCompetitions(request: ListCompetitionsQuery): Promise<CompetitionList> {
        return await CompetitionModel.findAndCountAll({
            attributes: ["id", "title", "startDate", "endDate"],
            where: { endDate: { [Op.lt]: Date.now() }},
            limit: request.limit,
            offset: request.offset
        })
        .then(res => new CompetitionList(res.rows.map(this.toDto), res.count, request.limit, request.offset))
        .catch(err => { throw new InternalServerErrorException(String(err)); });
    }

    private toDto(instance: CompetitionModel): CompetitionDto {
        return {
            id: instance.id,
            title: instance.title,
            startDate: instance.startDate,
            endDate: instance.endDate
        };
    }
}