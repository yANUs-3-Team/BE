import * as commentsService from '../services/comments.service.js';

//댓글 관련 컨트롤러

/**
 * 댓글 생성
 */
export const createComment = async (req, res) => {
    try {
        const comment = await commentsService.createComment(req.params.article_id, req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/** 
 * 댓글 조회
*/
export const getCommentsByArticleId = async (req, res) => {
    try {
        const comments = await commentsService.getCommentsByArticleId(req.params.article_id);
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 댓글 수정
 */
export const updateComment = async (req, res) => {
    try {
        const result = await commentsService.updateComment(req.params.comment_id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '댓글 수정이 완료되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (req, res) => {
    try {
        const result = await commentsService.deleteComment(req.params.comment_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '댓글 삭제가 완료되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};