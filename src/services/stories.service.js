// 동화(Story) 관련 서비스 (점진적 생성 방식)

import pool from '../config/database.js';

/**
 *  새로운 동화를 시작
 *  @param {number} userId - 사용자 ID
 *  @returns {Promise<number>} - 새로 생성된 story_id
 */
export const startNewStory = async (userId) => {
  const query = 'INSERT INTO Story (user_id, title) VALUES (?, ?)';
  // 제목은 나중에 설정되므로, 초기에는 빈 문자열이나 NULL로 설정합니다.
  const [result] = await pool.query(query, [userId, '']); 
  if (!result.insertId) {
    throw new Error('새로운 Story를 시작하는 데 실패했습니다.');
  }
  return result.insertId;
};

/**
 *  동화에 새로운 페이지 추가
 *  @param {number} storyId - 페이지를 추가할 동화의 ID
 *  @param {object} pageData - 페이지 데이터 { content, imageUrl }
 *  @returns {Promise<number>} - 새로 생성된 story_content_id
 */
export const addPageToStory = async (storyId, pageData) => {
  const { content, imageUrl } = pageData;
  const query = 'INSERT INTO Story_content (story_id, content, img_url) VALUES (?, ?, ?)';
  const [result] = await pool.query(query, [storyId, content, imageUrl || null]);
  if (!result.insertId) {
    throw new Error('페이지를 추가하는 데 실패했습니다.');
  }
  return result.insertId;
};

/**
 *  동화 제목을 설정
 *  @param {number} storyId - 제목을 설정할 동화의 ID
 *  @param {string} title - 설정할 제목
 *  @returns {Promise<boolean>} - 성공 여부
 */
export const updateStoryTitle = async (storyId, title) => {
  const query = 'UPDATE Story SET title = ? WHERE story_id = ?';
  const [result] = await pool.query(query, [title, storyId]);
  // affectedRows가 0보다 크면 업데이트 성공
  return result.affectedRows > 0;
};
