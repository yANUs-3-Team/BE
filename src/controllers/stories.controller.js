// 동화 관련 컨트롤러 (점진적 생성 방식)

import {
  startNewStory,
  addPageToStory,
  updateStoryTitle
} from '../services/stories.service.js';

/**
 *  새로운 동화 시작 컨트롤러 (AI 연동)
 */
export const startStoryController = async (req, res) => {
  // 1. 인증 미들웨어를 통과한 사용자 ID를 가져옵니다.
  const userId = req.user.id;

  // 2. 프론트엔드에서 보낸 동화 설정값들을 req.body에서 가져옵니다.
  const { name, personality, characteristics, location, era, genre, ending_point } = req.body;

  // 3. 필수 설정값 유효성 검사 (예시)
  if (!name || !genre) {
    return res.status(400).json({ message: '주인공 이름과 장르는 필수입니다.' });
  }

  const storySettings = { name, personality, characteristics, location, era, genre, ending_point };

  try {
    // 4. 서비스 계층에 사용자 ID와 설정값을 전달하여 새로운 동화 생성을 요청합니다.
    const newStoryData = await startNewStory(userId, storySettings);
    
    // 5. 생성된 storyId와 AI가 만들어준 첫 페이지 데이터를 프론트엔드에 전달합니다.
    res.status(201).json({ message: '새로운 동화가 시작되었습니다.', data: newStoryData });

  } catch (error) {
    // 서비스에서 발생한 에러를 최종 처리
    res.status(500).json({ message: error.message || '서버 내부 오류가 발생했습니다.' });
  }
};

/**
 *  페이지 추가 컨트롤러
 */
export const addPageController = async (req, res) => {
  const { storyId } = req.params;
  const { content, imageUrl } = req.body;

  if (!content) {
    return res.status(400).json({ message: '페이지 내용(content)은 필수입니다.' });
  }

  try {
    const newPageId = await addPageToStory(storyId, { content, imageUrl });
    res.status(201).json({ message: '페이지가 성공적으로 추가되었습니다.', pageId: newPageId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 *  제목 설정 컨트롤러
 */
export const updateTitleController = async (req, res) => {
  const { storyId } = req.params;
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: '제목(title)은 필수입니다.' });
  }

  try {
    const success = await updateStoryTitle(storyId, title);
    if (success) {
      res.status(200).json({ message: '제목이 성공적으로 설정되었습니다.' });
    } else {
      res.status(404).json({ message: '해당 동화를 찾을 수 없거나 업데이트에 실패했습니다.' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
