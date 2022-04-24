import { Injectable } from "@nestjs/common";
import { Usecase } from "../../../../kernel/Usecase";
import { ListProgramsQuery } from "./list-programs.query";
import { Portfolio } from "./portfolio";

@Injectable()
export class ListProgramsUsecase implements Usecase<ListProgramsQuery, Portfolio> {
    execute(request: ListProgramsQuery): Promise<Portfolio> {
        throw new Error("Method not implemented.");
    }
}