import pool from '../config/database.js';
import axios from 'axios';

/**
 *  동화 생성 시작
 *  @param {number} userId - 사용자 ID
 *  @param {object} storySettings - 동화 설정값 { name, personality, ... }
 *  @returns {Promise<object>} - 새로 생성된 storyId와 AI가 생성한 첫 페이지 데이터
 */
export const startNewStory = async (userId, storySettings) => {
  const connection = await pool.getConnection();
  
  try {
    // 1. AI 백엔드 연동 부분 주석 처리 및 목 데이터 사용
    const aiResponse = await axios.post(`${process.env.AI_BACKEND_URL}/sessions`, storySettings);
    const initialPageData = aiResponse.data;
    console.log('InitalPageData:', initialPageData);
    
    await connection.beginTransaction();
    const storyQuery = 'INSERT INTO Story (user_id, title) VALUES (?, ?)';
    const [storyResult] = await connection.query(storyQuery, [userId, '']);
    const newStoryId = storyResult.insertId;

    if (!newStoryId) {
      throw new Error('Story 생성에 실패했습니다.');
    }
    const contentQuery = `
      INSERT INTO Story_content (story_id, page_number, content, img_url, choice_1, choice_2, choice_3, choice_4, ai_session_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { page_number, story, image, choices_1, choices_2, choices_3, choices_4, session_Id } = initialPageData;
    await connection.query(contentQuery, [newStoryId, page_number, story, image || null, choices_1, choices_2, choices_3, choices_4, session_Id]);
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
 *  @param {object} selectData - 선택지 데이터 { choiceNumber, aiSessionId } // Updated JSDoc
 *  @returns {Promise<object>} - 추가된 페이지 데이터
 */
export const addPageToStory = async (storyId, { choiceNumber, aiSessionId }) => {
  const connection = await pool.getConnection();

  try {
    console.log('addPageToStory: Sending request to AI backend...');
    console.log('URL:', `${process.env.AI_BACKEND_URL}/sessions/${aiSessionId}/choose`);
    console.log('Payload:', { "choice_id": choiceNumber});

    const aiResponse = await axios.post(`${process.env.AI_BACKEND_URL}/sessions/${aiSessionId}/choose`, { "choice_id": choiceNumber });
    const additonalPage = aiResponse.data;
    console.log('addPageToStory: Received response from AI backend:', additonalPage);

    await connection.beginTransaction();
    const contentQuery = `
      INSERT INTO Story_content (story_id, page_number, content, img_url, choice_1, choice_2, choice_3, choice_4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { page_number, story, image, choices_1, choices_2, choices_3, choices_4 } = additonalPage;
    console.log('addPageToStory: Inserting into DB with page_number:', page_number);
    await connection.query(contentQuery, [storyId, page_number, story, image || null, choices_1, choices_2, choices_3, choices_4]);
    await connection.commit();
    console.log('addPageToStory: Page added successfully to DB.');
    return { story_id: storyId, ...additonalPage };

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
    console.log('addPageToStory: Database connection released.');
  }
};

/**
 *  (3) 동화의 제목을 설정(업데이트)합니다.
 */
export const updateStoryTitle = async (storyId, title) => {
  // TODO: 나중에 DB에 제목을 업데이트하는 로직 구현 필요
  console.log(`(임시) ${storyId} 동화의 제목을 '${title}'(으)로 설정`);
  return Promise.resolve();
};