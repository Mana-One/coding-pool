import { Injectable, Logger } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Cron } from "@nestjs/schedule";
import { Op, Transaction } from "sequelize";
import { SequelizeService } from "../../../../infrastructure/sequelize/sequelize.service";
import { WINNER_COMPUTED } from "../../../shared-kernel/constants";
import { WinnerComputed } from "../../../shared-kernel/winner-computed.event";
import { CompetitionModel } from "../competitions/competition.model";
import { SubmissionModel } from "../submissions/submission.model";

@Injectable()
export class WinnerNotifierCron {
    private logger = new Logger(WinnerNotifierCron.name);

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly sequelizeService: SequelizeService
    ) {}

    @Cron("0 0 1 * * *")
    async execute() {
        const [yesterday, now] = this.getBoundaries();

        const transaction = await this.sequelizeService.beginTransaction();
        try {
            const competitions = await this.fetchCompetitions(yesterday, now, transaction);
            await this.computeWinners(competitions, transaction);
            await transaction.commit();

        } catch(err) {
            if (transaction) {
                await transaction.rollback();
            }
            this.logger.error(err);
        }
    }

    private getBoundaries(): [Date, Date] {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const yesterday = new Date();
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        return [yesterday, now];
    }

    private async fetchCompetitions(
        yesterday: Date, 
        now: Date, 
        transaction: Transaction
    ): Promise<CompetitionModel[]> {
        return CompetitionModel.findAll({
            where: {
                endDate: {
                    [Op.gte]: yesterday,
                    [Op.lt]: now
                }
            }, 
            transaction
        });
    }

    private async computeWinners(
        competitions: CompetitionModel[], 
        transaction: Transaction
    ): Promise<void> {
        await Promise.all(competitions.map(async competition => {
            const submissions = await SubmissionModel.findAll({
                where: { competitionId: competition.id },
                order: [["passed", "DESC"], ["time", "ASC"]],
                limit: 1,
                offset: 0,
                transaction
            });

            if (submissions.length > 0) {
                this.eventEmitter.emit(WINNER_COMPUTED, new WinnerComputed(
                    competition.id,
                    submissions[0].participantId,
                    new Date()
                ));
            }
        }));
    }
}