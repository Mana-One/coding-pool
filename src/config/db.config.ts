import { Injectable } from "@nestjs/common";

@Injectable()
export class DbConfig {
    constructor(
        readonly DIALECT: string,
        readonly HOST: string,
        readonly USER: string,
        readonly PASSWORD: string, 
        readonly NAME: string,
        readonly PORT: number 
    ) {}
}