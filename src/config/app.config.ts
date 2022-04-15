import { Injectable } from "@nestjs/common";

@Injectable()
export class AppConfig {
    constructor(
        readonly PORT: number,
        readonly JWT_SECRET: string
    ) {}
}