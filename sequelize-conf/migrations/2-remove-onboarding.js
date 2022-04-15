module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("Account", "onboarding");
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("Account", "onboarding", {
            type: Sequelize.DataTypes.STRING,
            defaultValue: null
        });
    }
};