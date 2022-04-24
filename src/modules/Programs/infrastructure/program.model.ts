import { AllowNull, Column, CreatedAt, DataType, Min, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

interface ProgramProps {
    id: string 
    title: string
    content: string 
    languageId: number 
    authorId: string
}

@Table({
    modelName: "programs",
    tableName: "programs"
})
export class ProgramModel extends Model<ProgramProps> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Column(DataType.STRING(100))
    title: string;
    
    @AllowNull(false)
    @Column(DataType.TEXT)
    content: string;
    
    @Min(0)
    @AllowNull(false)
    @Column(DataType.INTEGER)
    languageId: number;
    
    @AllowNull(false)
    @Column(DataType.UUID)
    authorId: string;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;
}