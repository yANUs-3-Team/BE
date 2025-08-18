import express from 'express';
import {
    createComment,
    getCommentsByArticleId,
    updateComment,
    deleteComment
} from '../controllers/comments.controller.js';

const router = express.Router({ mergeParams: true });

// 댓글 생성
router.post('/', createComment);

// 전체 댓글 가져오기
router.get('/', getCommentsByArticleId);

// 댓글 수정
router.put('/:comment_id', updateComment);

// 댓글 삭제
router.delete('/:comment_id', deleteComment);

export default router;
