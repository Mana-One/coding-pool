module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  },
  production: {
    url: process.env.DATABASE_URL,
    define: {
      charset: "utf8mb4",
      collate: "utf8mb4_general_ci"
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}