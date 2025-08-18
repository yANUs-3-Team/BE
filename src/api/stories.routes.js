// /api/stories 경로에 대한 라우터 (점진적 생성 방식)

import express from 'express';
import {
  startStoryController,
  addPageController,
  updateTitleController
} from '../controllers/stories.controller.js';

// TODO: JWT 인증 미들웨어 추가 필요

const router = express.Router();

// 1. 새로운 동화 시작
// POST /api/stories
router.post('/', startStoryController);

// 2. 특정 동화에 페이지 추가
// POST /api/stories/:storyId/pages
router.post('/:storyId/pages', addPageController);

// 3. 특정 동화의 제목 설정
// PUT /api/stories/:storyId
router.put('/:storyId', updateTitleController);


export default router;
