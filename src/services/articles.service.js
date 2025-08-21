// 게시판 관련 서비스

import db from '../config/database.js';

/**
 * 게시글 생성
 */
export const createArticle = async (articleData) => {
    const { user_id, title, content } = articleData;
    const [result] = await db.execute(
        'INSERT INTO articles (user_id, title, content) VALUES (?, ?, ?)',
        [user_id, title, content]
    );
    return { id: result.insertId, ...articleData };
};

/**
 * 전체 게시글 가져오기 (작성자 이름 포함)
 */
export const getAllArticles = async () => {
    const [rows] = await db.execute('SELECT a.*, u.username FROM articles a JOIN users u ON a.user_id = u.user_id');
    return rows;
};

/**
 * 게시글 조회 (작성자 이름 포함)
 */
export const getArticleById = async (articleId) => {
    const [rows] = await db.execute('SELECT a.*, u.username FROM articles a JOIN users u ON a.user_id = u.user_id WHERE a.article_id = ?', [articleId]);
    return rows[0];
};

/**
 * 게시글 수정
 */
export const updateArticle = async (articleId, articleData) => {
    const { title, content } = articleData;
    const [result] = await db.execute(
        'UPDATE articles SET title = ?, content = ? WHERE article_id = ?',
        [title, content, articleId]
    );
    return { affectedRows: result.affectedRows };
};

/**
 * 게시글 삭제
 */
export const deleteArticle = async (articleId) => {
    const [result] = await db.execute('DELETE FROM articles WHERE article_id = ?', [articleId]);
    return { affectedRows: result.affectedRows };
};

/**
 * 본인 게시글 삭제
 */
export const deleteMyArticle = async (userId, articleId) => {
    const [result] = await db.execute(
        'DELETE FROM articles WHERE article_id = ? AND user_id = ?',
        [articleId, userId]
    );
    return { affectedRows: result.affectedRows };
};