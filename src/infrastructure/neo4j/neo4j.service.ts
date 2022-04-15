import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { auth, Driver, driver, Session } from "neo4j-driver";
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
}