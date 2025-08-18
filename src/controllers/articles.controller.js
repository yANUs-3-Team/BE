import * as articlesService from '../services/articles.service.js';

/**
 * 게시글 생성
 */
export const createArticle = async (req, res) => {
    try {
        const article = await articlesService.createArticle(req.body);
        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**     
 * 전체 게시글 가져오기
*/
export const getAllArticles = async (req, res) => {
    try {
        const articles = await articlesService.getAllArticles();
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 게시글 조회
 */
export const getArticleById = async (req, res) => {
    try {
        const article = await articlesService.getArticleById(req.params.article_id);
        if (!article) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 게시글 수정
 */
export const updateArticle = async (req, res) => {
    try {
        const result = await articlesService.updateArticle(req.params.article_id, req.body);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '게시글 수정이 완료되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 게시글 삭제
 */
export const deleteArticle = async (req, res) => {
    try {
        const result = await articlesService.deleteArticle(req.params.article_id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }
        res.status(200).json({ message: '게시글 삭제가 완료되었습니다.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};