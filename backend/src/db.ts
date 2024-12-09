import mysql from "mysql2/promise";

// Connection configuration
const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.user,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
};

// Create a connection pool
export const pool = mysql.createPool(dbConfig);
