import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { none, Option, some } from "fp-ts/lib/Option";
import { UID } from "../../../kernel/UID";
import { Program } from "../domain/program";
import { Programs } from "../domain/programs";
import { ProgramModel } from "./program.model";

@Injectable()
export class SequelizePrograms implements Programs {
    async findById(id: UID): Promise<Option<Program>> {
        throw new Error("Not implemented.");
    }

    async findByIdAndAuthor(id: UID, authorId: UID): Promise<Option<Program>> {
        const instance = await ProgramModel.findOne({
            where: {
                id: id.value,
                authorId: authorId.value
            }
        })
        .catch(err => { throw new InternalServerErrorException(String(err)); });

        if (instance === null) {
            return none;
        }
        return some(this.toDomain(instance));
    }

    async save(entity: Program): Promise<void> {
        await ProgramModel.upsert(this.toPersistence(entity))
            .catch(err => { throw new InternalServerErrorException(String(err)); });
    }



    private toPersistence(entity: Program) {
        return {
            id: entity.id.value,
            title: entity.title,
            content: entity.content,
            languageId: entity.languageId,
            authorId: entity.authorId.value
        };
    }
    
    private toDomain(instance: ProgramModel): Program {
        return Program.of({
            id: UID.of(instance.id),
            title: instance.title,
            content: instance.content,
            languageId: instance.languageId,
            authorId: UID.of(instance.authorId)
        });
    }
}