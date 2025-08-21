import pool from '../config/database.js';
import axios from 'axios';

/**
 *  동화 생성 시작
 *  @param {number} userId - 사용자 ID
 *  @param {object} storySettings - 동화 설정값 { name, personality, ... }
 *  @returns {Promise<object>} - 새로 생성된 storyId와 AI가 생성한 첫 페이지 데이터
 */
export const startNewStory = async (userId, storySettings) => {
  const endingPoint = storySettings.ending_point;
  const connection = await pool.getConnection();
  
  try {
    const aiResponse = await axios.post(`${process.env.AI_BACKEND_URL}/sessions`, storySettings);
    const initialPageData = aiResponse.data;
    const { page_number, story, image, choices_1, choices_2, choices_3, choices_4, session_id, ending_point } = initialPageData;
    
    console.log('InitalPageData:', initialPageData);
    
    await connection.beginTransaction();
    // Story 테이블에 ending_point 저장
    const storyQuery = 'INSERT INTO Story (user_id, title, ending_point) VALUES (?, ?, ?)';
    const [storyResult] = await connection.query(storyQuery, [userId, '', endingPoint]);
    const newStoryId = storyResult.insertId;

    if (!newStoryId) {
      throw new Error('Story 생성에 실패했습니다.');
    }

    const contentQuery = `
      INSERT INTO Story_content (story_id, page_number, content, img_url, choice_1, choice_2, choice_3, choice_4, ai_session_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    console.log('startNewStory: session_id being inserted into DB:', session_id);
    await connection.query(contentQuery, [newStoryId, page_number, story, image || null, choices_1, choices_2, choices_3, choices_4, session_id]);
    
    await connection.commit();
    return { story_id: newStoryId, ...initialPageData };

  } catch (error) {
    if (connection) await connection.rollback(); 
    if (error.response) {
      console.error('AI Backend Error:', error.response.data);
    } else {
      console.error('DB/Service Error:', error.message);
    }
    throw error;

  } finally {
    if (connection) connection.release();
  }
};

/**
 *  새로운 페이지를 추가
 *  @param {number} storyId - 동화 ID
 *  @param {object} selectData - 선택지 데이터 { choiceNumber, aiSessionId }
 *  @returns {Promise<object>} - 추가된 페이지 데이터와 종료 여부(finish)
 */
export const addPageToStory = async (storyId, { choiceNumber, aiSessionId }) => {
  const connection = await pool.getConnection();

  try {
    // Story 테이블에서 ending_point 조회
    const [storyRows] = await connection.query('SELECT ending_point FROM Story WHERE story_id = ?', [storyId]);
    if (storyRows.length === 0) {
      throw new Error('Story not found');
    }
    const ending_point = storyRows[0].ending_point;

    // AI 백엔드로부터 다음 페이지 정보 요청
    const aiResponse = await axios.post(`${process.env.AI_BACKEND_URL}/sessions/${aiSessionId}/choose`, { "choice_id": choiceNumber, "session_id": aiSessionId });
    const additionalPage = aiResponse.data;
    const { page_number, story, image, choices_1, choices_2, choices_3, choices_4 } = additionalPage;

    // 데이터베이스에 새 페이지 정보 저장
    await connection.beginTransaction();
    const contentQuery = `
      INSERT INTO Story_content (story_id, page_number, content, img_url, choice_1, choice_2, choice_3, choice_4, select_choice)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await connection.query(contentQuery, [storyId, page_number, story, image || null, choices_1, choices_2, choices_3, choices_4, choiceNumber]);
    await connection.commit();
    console.log('addPageToStory: Page added successfully to DB.');

    // 종료 조건 확인
    let finish = false;
    if (ending_point && page_number === ending_point) {
      finish = true;
      // Ending point에 도달했을때 AI 백엔드에 title을 만들라고 요청
      //const aiResponse = await axios.post(`${process.env.AI_BACKEND_URL}/sessions/${aiSessionId}/end`, { "session_id": aiSessionId });
      //const { title } = aiResponse.data;
      //await updateStoryTitle(storyId, title);
      //console.log('addPageToStory: 엔딩 포인트 도달, 제목 업데이트:', title);
    }

    return { story_id: storyId, ...additionalPage, finish };

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('addPageToStory: Error caught!');
    if (error.response) {
      console.error('AI 백엔드 에러:', error.response.data);
      console.error('AI 백엔드 에러 상태:', error.response.status);
      console.error('AI 백엔드 에러 헤더:', error.response.headers);
    } else if (error.request) {
      console.error('AI 백엔드 응답 없음:', error.request);
    } else {
      console.error('DB/서비스 에러:', error.message);
    }
    throw error;
  } finally {
    if (connection) connection.release();
    console.log('addPageToStory: 데이터 베이스 연결이 해제되었습니다.');
  }
};

/**
 *  동화 제목 설정
 */
export const updateStoryTitle = async (storyId, title) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const updateQuery = 'UPDATE Story SET title = ? WHERE story_id = ?';
    const [result] = await connection.query(updateQuery, [title, storyId]);
    await connection.commit();
    return Promise.resolve();
  } catch (error) {
    if (connection) await connection.rollback();
    console.error('updateStoryTitle: Error caught!');
    console.error('DB/서비스 에러:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

/**
 *  특정 동화의 기본 정보 조회
 */
export const getStoryById = async (storyId) => {
  const connection = await pool.getConnection();

  try {
    const [rows] = await connection.query('SELECT * FROM Story WHERE story_id = ?', [storyId]);
    return rows[0] || null;
  } catch (error) {
    console.error('getStoryById: Error caught!');
    console.error('DB/서비스 에러:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};

/**
 *  동화의 전체 정보 (기본 정보 + 모든 페이지) 조회
 *  @param {number} storyId - 동화 ID
 *  @returns {Promise<object|null>} - 동화 전체 정보 객체
 */
export const getFullStoryById = async (storyId) => {
  // 1. 동화 기본 정보 조회
  const storyInfo = await getStoryById(storyId);
  if (!storyInfo) {
    return null; // 동화가 없으면 null 반환
  }

  // 2. 동화 내용 페이지 조회
  const storyPages = await getStoryContents(storyId);

  // 3. 정보 조합하여 최종 객체 생성
  const fullStory = {
    story_id: storyInfo.story_id,
    title: storyInfo.title,
    created_at: storyInfo.created_at,
    pages: storyPages
  };

  return fullStory;
};

/**
 *  동화의 모든 내용 페이지 조회
 *  @param {number} storyId - 동화 ID
 *  @returns {Promise<Array<object>>} - 동화 내용 페이지 배열
 */
export const getStoryContents = async (storyId) => {
  const connection = await pool.getConnection();
  try {
    const query = `
      SELECT DISTINCT page_number, content, img_url
      FROM story_content 
      WHERE story_id = ? 
      ORDER BY page_number ASC
    `;
    const [rows] = await connection.query(query, [storyId]);
    console.log('getStoryContents: 동화 내용 페이지 조회 성공:', rows);
    return rows;
  } catch (error) {
    console.error('getStoryContents: Error caught!');
    console.error('DB/서비스 에러:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};


export const getStoryCreationName = async (storyId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT name FROM Story WHERE story_id = ?', [storyId]);
    return rows[0]?.name || null;
  } catch (error) {
    console.error('getStoryCreationName: Error caught!');
    console.error('DB/서비스 에러:', error.message);
    throw error;
  } finally {
    if (connection) connection.release();
  }
};