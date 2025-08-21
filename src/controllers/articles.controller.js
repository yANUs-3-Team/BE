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
        const { article_id } = req.params;
        const user_id = req.user.id; // Assuming req.user.id is available from verifyToken middleware

        // 1. 게시글 존재 여부 및 소유자 확인
        const article = await articlesService.getArticleById(article_id);
        if (!article) {
            return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
        }

        // 2. 인가 확인: 게시글 소유자만 삭제 가능
        if (article.user_id !== user_id) {
            return res.status(403).json({ message: '게시글을 삭제할 권한이 없습니다.' });
        }

        // 3. 게시글 삭제 (articlesService.deleteMyArticle 사용)
        const result = await articlesService.deleteMyArticle(user_id, article_id);
        
        if (result.affectedRows === 0) {
            // 이 경우는 권한 확인 후에도 삭제되지 않은 경우 (예: 동시성 문제)
            return res.status(404).json({ message: '게시글 삭제에 실패했습니다. 게시글을 찾을 수 없거나 권한이 없습니다.' });
        }

        res.status(200).json({ message: '게시글 삭제가 완료되었습니다.' });
    } catch (error) {
        console.error('게시글 삭제 중 오류 발생:', error);
        res.status(500).json({ message: error.message });
    }
};