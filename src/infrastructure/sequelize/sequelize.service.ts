import { Injectable } from "@nestjs/common";
import { Sequelize } from "sequelize-typescript";
import { AccountModel } from "../../modules/accounts/infrastructure/account.model";
import { UserStatsModel } from "../../modules/Social/user-stats/infrastructure/user-stats.model";

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

        sequelize.addModels([AccountModel, UserStatsModel]);
        return new SequelizeService(sequelize);
    }
}