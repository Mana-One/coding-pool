module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("competitions", "status", {
            type: Sequelize.DataTypes.STRING,
            defaultValue: "in-progress"
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("competitions", "status");
    }
};