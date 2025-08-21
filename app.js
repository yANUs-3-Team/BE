import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import userRoutes from './src/api/users.routes.js';
import articleRoutes from './src/api/articles.routes.js';
import storyRoutes from './src/api/stories.routes.js';

// .env 파일 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// CORS 옵션 설정
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // 허용할 프론트엔드 주소
  credentials: true, // 쿠키를 주고받기 위한 설정
};

// 미들웨어 설정
app.use(cors(corsOptions));
app.use(express.json());
app.use(helmet());
app.use(cookieParser());

app.use((req, res, next) => {
  console.log("[dbg] method:", req.method);
  console.log("[dbg] url:", req.originalUrl);
  console.log("[dbg] content-type:", req.headers["content-type"]);
  console.log("[dbg] has body?:", typeof req.body);
  console.log("[dbg] body:", req.body);
  next();
});

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, Express 백엔드 서버!');
});

// API 라우트 설정
app.use('/users', userRoutes);
app.use('/articles', articleRoutes);
app.use('/stories', storyRoutes);
app.disable('x-powered-by');

// custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("뭐가 좀 이상한데요?");
});

// custom 404 페이지
app.use((req, res, next) => {
  res.status(404).send("404 에럽니다");
});

// 서버 시작
app.listen(port, () => {
  console.log(`서버가 ${port}포트에서 실행 중입니다.`);
});
