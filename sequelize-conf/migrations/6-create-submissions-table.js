module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("submissions", {
            competitionId: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            participantId: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            participant: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            passed: {
                type: Sequelize.DataTypes.BOOLEAN,
                allowNull: false 
            },
            time: {
                type: Sequelize.DataTypes.DECIMAL(10, 3),
                allowNull: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("submissions");
    }
};