import { Injectable } from "@nestjs/common";

@Injectable()
export class RabbitMqConfig {
    constructor(
       readonly URL: string
    ) {}
}