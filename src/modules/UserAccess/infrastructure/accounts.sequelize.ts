import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { InjectS3, S3 } from "nestjs-s3";
import { S3Config } from "../../../config/s3.config";
import { SequelizeService } from "../../../infrastructure/sequelize/sequelize.service";
import { UID } from "../../../kernel/UID";
import { Account } from "../domain/account";
import { Accounts } from "../domain/accounts";
import { AccountMapper } from "./account.mapper";
import { AccountModel } from "./account.model";

@Injectable()
export class SequelizeAccounts implements Accounts {
    constructor(
        private readonly sequelizeService: SequelizeService,
        private readonly mapper: AccountMapper,
        @InjectS3() private readonly s3: S3,
        private readonly s3Config: S3Config
    ) {
        console.log("adding hook")
        AccountModel.afterUpdate("cleaning picture storage", (instance, _) => {
            const previousPicture = instance.previous().picture;
            const currentPicture = instance.picture;

            if (previousPicture !== null && previousPicture !== currentPicture) {
                const key = previousPicture.slice(this.s3Config.READ_ENDPOINT.length);
                const params = {
                    Key: key,
                    Bucket: this.s3Config.BUCKET
                };
                this.s3.deleteObject(params, (err, data) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
        });
    }

    async findByEmail(email: string): Promise<Option<Account>> {
        const instance = await AccountModel.findOne(
            { where: { email }
        }).catch(err => { throw new InternalServerErrorException(String(err)); });
        return instance === null ? none : some(this.mapper.toDomain(instance));
    }

    async findById(id: UID): Promise<Option<Account>> {
        const instance = await AccountModel.findByPk(id.value)
            .catch(err => { throw new InternalServerErrorException(String(err)); });
        return instance === null ? none : some(this.mapper.toDomain(instance));
    }

    async isUsernameUsed(username: string): Promise<boolean> {
        const instance = await AccountModel.findOne({
            where: { username }
        }).catch(err => { throw new InternalServerErrorException(String(err)); });
        return instance !== null;
    }
    
    async save(entity: Account): Promise<void> {
        const transaction = await this.sequelizeService.beginTransaction();
        const { id, ...dto } = await this.mapper.toPersistence(entity);

        try {
            const [instance, created] = await AccountModel.findOrCreate({
                where: { id },
                defaults: dto,
                transaction
            });

            if (!created) {
                await instance.update(dto, { transaction });
            }
            await transaction.commit();

        } catch(err) {
            if (transaction) {
                await transaction.rollback();
            }
            throw new InternalServerErrorException(String(err));
        }
    }
}