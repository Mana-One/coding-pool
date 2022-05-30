import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

interface SubmissionProps {
    competitionId: string
    participantId: string 
    participant: string
    passed: boolean 
    time: number
}

@Table({
    modelName: "submissions",
    tableName: "submissions"
})
export class SubmissionModel extends Model<SubmissionProps> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    competitionId: string;

    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    participantId: string; 

    @AllowNull(false)
    @Column(DataType.STRING)
    participant: string;

    @AllowNull(false)
    @Column(DataType.BOOLEAN)
    passed: boolean; 

    @Column(DataType.DECIMAL(10, 3))
    time: number;
}