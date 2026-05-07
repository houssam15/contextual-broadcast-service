import mysql from 'mysql2/promise';
import {config} from "../../config/index.ts";

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
  keepAliveInitialDelay: 0
});

export default pool;