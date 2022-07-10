import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

interface CompetitionProps {
    id: string 
    title: string 
    description: string 
    startDate: Date 
    endDate: Date
    languageId: number 
    stdin: string 
    expectedStdout: string 
}

@Table({
    modelName: "competitions",
    tableName: "competitions",
    timestamps: false
})
export class CompetitionModel extends Model<CompetitionProps> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    id: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    title: string;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    description: string;
    
    @AllowNull(false)
    @Column(DataType.DATE)
    startDate: Date; 

    @AllowNull(false)
    @Column(DataType.DATE)
    endDate: Date;

    @AllowNull(false)
    @Column(DataType.INTEGER)
    languageId: number;
    
    @AllowNull(false)
    @Column(DataType.STRING)
    stdin: string;

    @AllowNull(false)
    @Column(DataType.STRING)
    expectedStdout: string;
}