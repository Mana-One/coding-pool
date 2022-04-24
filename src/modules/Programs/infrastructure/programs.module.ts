import { Module } from "@nestjs/common";
import { CreateProgramUsecase } from "../application/create-program/create-program.usecase";
import { ListProgramsUsecase } from "../application/list-programs/list-programs.usecase";
import { ReplaceContentUsecase } from "../application/replace-content/replace-content.usecase";
import { PROGRAMS } from "../constants";
import { ProgramsController } from "../exposition/programs.controller";
import { SequelizePrograms } from "./sequelize.programs";

@Module({
    providers: [
        CreateProgramUsecase, 
        ListProgramsUsecase, 
        ReplaceContentUsecase, {
            provide: PROGRAMS,
            useClass: SequelizePrograms
    }],
    controllers: [ProgramsController]
})
export class ProgramsModule {}