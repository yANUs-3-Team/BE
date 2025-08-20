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
    /* 목데이터 셋팅
    const initialPageData =  {
     "message": "새로운 동화가 시작되었습니다.",
     "data": {
       "story_id": 9, // 여기에 story_id가 포함됩니다.
        "page_number": 0,
        "story": "...123",
        "image": "...",
        "choices_1": "..123.",
        "choices_2": "..123.",
        "choices_3": ".123..",
        "choices_4": "..123."
      }
    };
    */

    // 2. 데이터베이스 트랜잭션 시작
    await connection.beginTransaction();

    // 3. Story 테이블에 새로운 동화 정보 삽입
    const storyQuery = 'INSERT INTO Story (user_id, title) VALUES (?, ?)';
    // 제목은 마지막에 설정되므로, 초기에는 임시로 비워둡니다.
    const [storyResult] = await connection.query(storyQuery, [userId, '']);
    const newStoryId = storyResult.insertId;

    if (!newStoryId) {
      throw new Error('Story 생성에 실패했습니다.');
    }

    // 4. AI가 생성한 첫 페이지 내용을 Story_content 테이블에 삽입
    const contentQuery = `
      INSERT INTO Story_content (story_id, page_number, content, img_url, choice_1, choice_2, choice_3, choice_4)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const { page_number, story, image, choices_1, choices_2, choices_3, choices_4 } = initialPageData;
    await connection.query(contentQuery, [newStoryId, page_number, story, image || null, choices_1, choices_2, choices_3, choices_4]);

    // 5. 모든 작업이 성공하면 커밋
    await connection.commit();

    // 6. 프론트엔드에 전달할 최종 결과 반환
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
 *  (2) 특정 동화에 새로운 페이지를 추가합니다.
 */
export const addPageToStory = async (storyId, pageData) => {
  // TODO: 나중에 DB에 페이지를 저장하는 로직 구현 필요
  console.log(`(임시) ${storyId} 동화에 페이지 추가:`, pageData);
  return Promise.resolve();
};

/**
 *  (3) 동화의 제목을 설정(업데이트)합니다.
 */
export const updateStoryTitle = async (storyId, title) => {
  // TODO: 나중에 DB에 제목을 업데이트하는 로직 구현 필요
  console.log(`(임시) ${storyId} 동화의 제목을 '${title}'(으)로 설정`);
  return Promise.resolve();
};
