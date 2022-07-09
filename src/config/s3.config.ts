import { Injectable } from "@nestjs/common";

@Injectable()
export class S3Config {
    constructor(
        readonly ACCESS_KEY: string,
        readonly SECRET_KEY: string,
        readonly BUCKET: string,
        readonly ENDPOINT: string
    ) {}
}