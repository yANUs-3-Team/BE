import express from 'express';
import mysql from 'mysql';
import dotenv from 'dotenv';
// .env 파일 로드
dotenv.config();

const app = express();
const port = 3000;

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, Express 백엔드 서버!');
});

// MySQL 연결 설정
const mysql = require('mysql');
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});