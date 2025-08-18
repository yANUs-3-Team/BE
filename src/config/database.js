import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 연결 테스트
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL에 연결되었습니다.');
    connection.release();
  } catch (error) {
    console.error('MySQL 연결 오류:', error);
  }
})();

export default pool;
