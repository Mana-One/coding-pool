import { Body, Controller, Get, Param, Post, Put, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { InjectS3, S3} from "nestjs-s3";
import { S3Config } from "../../../config/s3.config";
import { Public } from "../../../kernel/public.decorator";
import { Roles } from "../../../kernel/roles.decorator";
import { AccountService } from "../application/account.service";
import { ChangePasswordRequest } from "./ChangePasswordRequest";
import { CreateUserRequest } from "./CreateUserRequest";
import { EditAccountRequest } from "./EditAccountRequest";

@Controller("accounts")
export class AccountsController {
    constructor(
        private readonly s3Config: S3Config,
        private readonly service: AccountService,
        @InjectS3() private readonly s3: S3
    ) {}

    @Public()
    @Get("/check-username/:username")
    async isUsernameUsed(@Param("username") username: string) {
        const isUsernameUsed = await this.service.isUsernameUsed(username);
        return { isUsernameUsed };
    }

    @Public()
    @Post("register")
    @UseInterceptors(FileInterceptor("picture"))
    async register(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateUserRequest
    ) {
        const picture = file ? await this.uploadFile(file) : null;
        await this.service.register(body.username, body.email, picture, body.password);
    }

    @Roles("admin")
    @Post("register/admin")
    @UseInterceptors(FileInterceptor("picture"))
    async registerAdmin(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: CreateUserRequest
    ) {
        const picture = file ? await this.uploadFile(file) : null;
        await this.service.registerAdmin(body.username, body.email, picture, body.password);
    }

    @Put("me/password")
    async changePassword(
        @Req() request,
        @Body() body: ChangePasswordRequest
    ) {
        await this.service.changePassword(request.user.accountId, body.oldPassword, body.newPassword, body.confirmPassword);
    }

    @Put("me")
    @UseInterceptors(FileInterceptor("picture"))
    async edit(
        @Req() request,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: EditAccountRequest
    ) {
        const picture = file ? await this.uploadFile(file) : null;
        await this.service.edit(request.user.accountId, body.username, body.email, picture);
    }

    private async uploadFile(file: Express.Multer.File): Promise<string> {
        const key = `${new Date().getTime()}_${file.originalname}`;
        await this.s3.upload({
            Bucket: this.s3Config.BUCKET,
            Key: key,
            ContentType: file.mimetype,
            Body: file.buffer,
        }).promise();

        return new URL(key, this.s3Config.READ_ENDPOINT).toString();
    }
}