import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { AccountModel } from "../../modules/UserAccess/infrastructure/account.model";
import { ProgramModel } from "../../modules/Programs/infrastructure/program.model";
import { CompetitionModel } from "../../modules/CompetitiveMode/infrastructure/competitions/competition.model";
import { SubmissionModel } from "../../modules/CompetitiveMode/infrastructure/submissions/submission.model";
import { LastPropositionModel } from "../../modules/CompetitiveMode/infrastructure/last-propositions/last-proposition.model";

@Injectable()
export class SequelizeService {
    private constructor(private readonly sequelize: Sequelize) {}

    async beginTransaction() {
        return this.sequelize.transaction();
    }

    static init(url: string): SequelizeService {
        const sequelize = new Sequelize(url, {
            dialectOptions: {
                // ssl: {
                //     require: true,
                //     rejectUnauthorized: false
                // }
            },
            logging: false
        });

        sequelize.addModels([AccountModel, ProgramModel, CompetitionModel, SubmissionModel, LastPropositionModel]);
        return new SequelizeService(sequelize);
    }
}