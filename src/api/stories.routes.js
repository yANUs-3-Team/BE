// /api/stories 경로에 대한 라우터 (점진적 생성 방식)

import express from 'express';
import {
  startStoryController,
  addPageController,
  updateTitleController
} from '../controllers/stories.controller.js';
// 미들웨어 경로 및 이름 수정
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 1. 새로운 동화 시작 (인증 필요)
router.post('/', verifyToken, startStoryController);

// 2. 특정 동화에 페이지 추가 (인증 필요)
router.post('/:storyId/pages', verifyToken, addPageController);

// 3. 특정 동화의 제목 설정 (인증 필요)
router.put('/:storyId', verifyToken, updateTitleController);


export default router;