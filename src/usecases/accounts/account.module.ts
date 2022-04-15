import { Module } from "@nestjs/common";
import { ClientProxyFactory, Transport } from "@nestjs/microservices";
import { ConfigModule } from "../../config/config.module";
import { RabbitMqConfig } from "../../config/rabbitmq.config";
import { AccountService } from "./application/account.service";
import { ACCOUNTS, ACCOUNT_BUS } from "./constants";
import { AccountsController } from "./exposition/accounts.controller";
import { AccountMapper } from "./infrastructure/account.mapper";
import { SequelizeAccounts } from "./infrastructure/accounts.sequelize";

const clientProvider = {
    provide: ACCOUNT_BUS,
    useFactory: async (config: RabbitMqConfig) => {
        const client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [config.URL],
                queue: "account_queue",
                queueOptions: {
                    durable: false
                },
                noAck: true
            }
        });
        await client.connect();
        return client;
    },
    inject: [RabbitMqConfig]
};

@Module({
    imports: [ConfigModule],
    providers: [
        AccountService, 
        AccountMapper,
        {
            provide: ACCOUNTS,
            useClass: SequelizeAccounts
        },
        clientProvider
    ],
    exports: [AccountService],
    controllers: [AccountsController]
})
export class AccountModule {}