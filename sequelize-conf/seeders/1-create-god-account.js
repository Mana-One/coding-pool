require("dotenv").config();
const uuid = require("uuid");
const bcrypt = require("bcrypt");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Account", [{
            id: uuid.v1(),
            username: "Coding God",
            email: process.env.GOD_EMAIL,
            password: await bcrypt.hash(process.env.GOD_PASSWORD, 10),
            role: "admin"
        }]);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Account", { username: "Coding God" }, {});
    }
};