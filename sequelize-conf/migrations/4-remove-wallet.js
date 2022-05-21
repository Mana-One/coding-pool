module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.renameTable("Account", "accounts");
            await queryInterface.removeColumn("accounts", "wallet");
        });
    },
    down: async (queryInterface, Sequelize) => {
        return queryInterface.sequelize.transaction(async transaction => {
            await queryInterface.addColumn("accounts", "wallet", {
                type: Sequelize.DataTypes.STRING,
                defaultValue: null
            });
            await queryInterface.renameTable("accounts", "Account");
        });
    }
};