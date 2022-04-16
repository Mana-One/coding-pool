import { AllowNull, Column, DataType, Model, PrimaryKey, Table, Unique } from "sequelize-typescript";

interface AccountProps {
    id: string
    username: string 
    wallet: string | null
    email: string
    password: string | null
    role: string
}

@Table({
    modelName: "Account",
    tableName: "Account",
    timestamps: false
})
export class AccountModel extends Model<AccountProps> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUIDV1)
    id: string;

    @Unique
    @AllowNull(false)
    @Column
    username: string;

    @Column(DataType.STRING)
    wallet: string | null;

    @Unique
    @AllowNull(false)
    @Column
    email: string;

    @Column(DataType.STRING)
    password: string | null;

    @AllowNull(false)
    @Column
    role: string;
}