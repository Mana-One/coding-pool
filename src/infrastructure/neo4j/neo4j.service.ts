import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { auth, DateTime, Driver, driver, Session } from "neo4j-driver";
import { Neo4jConfig } from "../../config/neo4j.config";

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
    readonly driver: Driver;

    constructor(config: Neo4jConfig) {
        this.driver = driver(config.URL, auth.basic(config.USER, config.PASSWORD));
    }

    startSession(): Session {
        return this.driver.session();
    }

    async onApplicationShutdown(signal?: string) {
        await this.driver.close();
    }

    static parseDate(neo4jDateTime: DateTime): Date {
        const { year, month, day, hour, minute, second, nanosecond } = neo4jDateTime;
    
        const date = new Date(
            year.toInt(),
            month.toInt() - 1, // neo4j dates start at 1, js dates start at 0
            day.toInt(),
            hour.toInt(),
            minute.toInt(),
            second.toInt(),
            nanosecond.toInt() / 1000000 // js dates use milliseconds
        );
    
        return date;
    };
}