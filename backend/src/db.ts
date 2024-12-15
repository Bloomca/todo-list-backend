import mysql from "mysql2/promise";

// Connection configuration
const dbConfig: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
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

export function prepareInsertQuery(
  tableName: string,
  values: Record<string, any>
) {
  const { names, params } = Object.entries(values).reduce<{
    names: string[];
    params: string[];
  }>(
    (acc, [key, value]) => {
      acc.names.push(key);
      acc.params.push(value);
      return acc;
    },
    { names: [], params: [] }
  );

  const namesClause = names.join(", ");
  const valuesClause = names.map(() => "?").join(", ");

  const query = `INSERT INTO ${tableName} (${namesClause}) VALUES (${valuesClause})`;

  return { query, params };
}
