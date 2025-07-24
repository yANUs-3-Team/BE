
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // cors 임포트
import userRoutes from './src/api/users.routes.js';

// .env 파일 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors()); // CORS 미들웨어 추가
app.use(express.json()); // JSON 파싱 미들웨어

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, Express 백엔드 서버!');
});

// API 라우트 설정
app.use('/api/users', userRoutes);


// 서버 시작
app.listen(port, () => {
  console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});
