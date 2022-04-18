import { AllowNull, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";
import { UserStats } from "../dtos/user-stats";

@Table({
    modelName: "user_stats",
    tableName: "user_stats",
    timestamps: false
})
export class UserStatsModel extends Model<UserStats> {
    @PrimaryKey
    @AllowNull(false)
    @Column(DataType.UUID)
    id: string; 

    @AllowNull(false)
    @Column(DataType.STRING)
    username: string;
    
    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    following: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    followers: number;
    
    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    programs: number;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    competitions_entered: number;
    
    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    competitions_won: number;
}