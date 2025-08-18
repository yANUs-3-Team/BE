// 댓글 관련 서비스

import db from '../config/database.js';

/**
 * 댓글 생성
 */
export const createComment = async (articleId, commentData) => {
    const { user_id, content } = commentData;
    const [result] = await db.execute(
        'INSERT INTO article_comments (article_id, user_id, content) VALUES (?, ?, ?)',
        [articleId, user_id, content]
    );
    return { id: result.insertId, ...commentData };
};

/**
 * 댓글 가져오기
 */
export const getCommentsByArticleId = async (articleId) => {
    const [rows] = await db.execute('SELECT * FROM article_comments WHERE article_id = ?', [articleId]);
    return rows;
};

/**
 * 댓글 수정
 */
export const updateComment = async (commentId, commentData) => {
    const { content } = commentData;
    const [result] = await db.execute(
        'UPDATE article_comments SET content = ? WHERE comment_id = ?',
        [content, commentId]
    );
    return { affectedRows: result.affectedRows };
};

/**
 * 댓글 삭제
 */
export const deleteComment = async (commentId) => {
    const [result] = await db.execute('DELETE FROM article_comments WHERE comment_id = ?', [commentId]);
    return { affectedRows: result.affectedRows };
};