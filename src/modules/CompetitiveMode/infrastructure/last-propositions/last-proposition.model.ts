import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript"

interface LastPropositionProps {
    competitionId: string 
    participantId: string 
    sourceCode: string
}

@Table({
    modelName: "last_propositions",
    tableName: "last_propositions",
    timestamps: false
})
export class LastPropositionModel extends Model<LastPropositionProps> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    competitionId: string;

    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    participantId: string; 

    @AllowNull(false)
    @Column(DataType.TEXT)
    sourceCode: string;
}