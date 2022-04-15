module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("Account", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            username: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            wallet: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: null
            },
            email: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            password: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: null
            },
            role: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: null
            },
            onboarding: {
                type: Sequelize.DataTypes.STRING,
                defaultValue: null
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("Account");
    }
};