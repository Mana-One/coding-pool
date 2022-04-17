module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("user_stats", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            username: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            followers: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: null
            },            
            following: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: null
            },
            programs: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: null
            },
            competitions_entered: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: null
            },
            competitions_won: {
                type: Sequelize.DataTypes.INTEGER,
                defaultValue: null
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("user_stats");
    }
};