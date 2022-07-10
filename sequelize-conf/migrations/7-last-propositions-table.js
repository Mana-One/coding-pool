module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("last_propositions", {
            competitionId: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            participantId: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            sourceCode: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("last_propositions");
    }
};