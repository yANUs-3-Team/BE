// /stories 경로에 대한 라우터
import express from 'express';
import {
  startStoryController,
  addPageController,
  updateTitleController
} from '../controllers/stories.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// 1. 새로운 동화 시작
router.post('/', authMiddleware,startStoryController);

// 2. 특정 동화에 페이지 추가
router.post('/:storyId/pages', addPageController);

// 3. 특정 동화의 제목 설정
router.put('/:storyId', updateTitleController);


export default router;