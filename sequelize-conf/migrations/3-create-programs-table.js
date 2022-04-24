module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable("programs", {
            id: {
                type: Sequelize.DataTypes.UUID,
                primaryKey: true
            },
            title: {
                type: Sequelize.DataTypes.STRING(100),
                allowNull: false
            },

            content: {
                type: Sequelize.DataTypes.TEXT,
                allowNull: false
            },
            languageId: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false
            },
            authorId: {
                type: Sequelize.DataTypes.UUID,
                allowNull: false
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
                allowNull: false
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable("programs");
    }
};