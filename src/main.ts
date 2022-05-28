import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as bodyParser from "body-parser";
import { AppConfig } from "./config/app.config";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors();
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  
    const port = app.get(AppConfig).PORT;
    await app.listen(port);

    const logger = new Logger('bootstrap');
    logger.log(`Application started on port ${port}`);
}
  
bootstrap();