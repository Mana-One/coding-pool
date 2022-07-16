module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DB_DIALECT,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    seederStorage: "sequelize"
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DB_DIALECT,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    },
    seederStorage: "sequelize"
  }
}