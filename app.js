
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './src/api/users.routes.js';
import articleRoutes from './src/api/articles.routes.js';
import storyRoutes from './src/api/stories.routes.js';

// .env 파일 로드
dotenv.config();

const app = express();
const port = process.env.PORT ||5000;
const helmet = require('helmet');

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(helmet());

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, Express 백엔드 서버!');
});

// API 라우트 설정
app.use('/users', userRoutes);
app.use('/articles', articleRoutes);
app.use('/stories', storyRoutes);


// 서버 시작
app.listen(port, () => {
  console.log(`서버가 ${port}포트에서 실행 중입니다.`);
});
