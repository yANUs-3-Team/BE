import express from 'express';
import {
    createArticle,
    getAllArticles,
    getArticleById,
    updateArticle,
    deleteArticle
} from '../controllers/articles.controller.js';
import commentRoutes from './comments.routes.js';
import { verifyToken } from '../middlewares/auth.middleware.js'; // Import verifyToken

const router = express.Router();

// 게시글 생성
router.post('/', createArticle);

// 전체 게시글 가져오기
router.get('/', getAllArticles);

// 게시글 조회
router.get('/:article_id', getArticleById);

// 게시글 수정
router.put('/:article_id', updateArticle);

// 게시글 삭제 (인증 및 인가 적용)
router.delete('/:article_id', verifyToken, deleteArticle); // Apply verifyToken middleware

// 댓글 관련 라우터 사용
router.use('/:article_id/comments', commentRoutes);

export default router;
