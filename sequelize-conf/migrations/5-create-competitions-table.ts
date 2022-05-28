module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("competitions", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            title: {
                type: Sequelize.DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            description: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            startDate: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            },
            endDate: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            },
            languageId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            stdin: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            },
            stdout: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false
            }
        })
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("competitions");
    }
};