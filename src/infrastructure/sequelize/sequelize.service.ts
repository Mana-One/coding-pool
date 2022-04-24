import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { AccountModel } from "../../modules/accounts/infrastructure/account.model";
import { ProgramModel } from "../../modules/Programs/infrastructure/program.model";

@Injectable()
export class SequelizeService {
    private constructor(private readonly sequelize: Sequelize) {}

    async beginTransaction() {
        return this.sequelize.transaction();
    }

    static init(url: string): SequelizeService {
        const sequelize = new Sequelize(url, {
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            logging: false
        });

        sequelize.addModels([AccountModel, ProgramModel]);
        return new SequelizeService(sequelize);
    }
}