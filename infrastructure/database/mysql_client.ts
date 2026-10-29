const { hmRequire } = require("../../config/hm_require.ts");
const mysql = hmRequire('mysql2/promise');
const { config } = require("../../config/index.ts");

const pool = mysql.createPool({
  host: config.db.mySql.host,
  user: config.db.mySql.user,
  port: config.db.mySql.port,
  password: config.db.mySql.password,
  database: config.db.mySql.database,
  waitForConnections: true,
  connectionLimit: config.db.mySql.connectionLimit,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

export default pool;