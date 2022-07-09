module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("accounts", "picture", {
            type: Sequelize.DataTypes.STRING,
            defaultValue: null
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn("accounts", "picture");
    }
};