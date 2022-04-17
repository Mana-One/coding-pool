import { Injectable } from "@nestjs/common";

@Injectable()
export class DbConfig {
    constructor(
        readonly URL: string
    ) {}
}