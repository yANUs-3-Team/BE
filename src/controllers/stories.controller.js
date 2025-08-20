// 동화 관련 컨트롤러 (점진적 생성 방식)

import {
  startNewStory,
  addPageToStory,
  updateStoryTitle,
} from '../services/stories.service.js';

/**
 *  새로운 동화 시작 컨트롤러 (AI 연동)
 */
export const startStoryController = async (req, res) => {
  const userId = req.user.user_id;
  const { name, personality, characteristics, location, era, genre, ending_point } = req.body;
  if (!name || !genre) {
    return res.status(400).json({ message: '주인공 이름과 장르는 필수입니다.' });
  }

  const storySettings = { name, personality, characteristics, location, era, genre, ending_point };

  try {
    const newStoryData = await startNewStory(userId, storySettings);
    res.status(201).json({ message: '새로운 동화가 시작되었습니다.', data: newStoryData });
  } catch (error) {
    res.status(500).json({ message: error.message || '서버 내부 오류가 발생했습니다.' });
  }
};

/**
 *  페이지 추가 컨트롤러
 */
export const addPageController = async (req, res) => {
  const { storyId } = req.params;
  const { session_id, choice } = req.body;

  if (!choice || !session_id) {
    return res.status(400).json({ message: '선택지 번호(choice)와 세션 ID(session_id)는 필수입니다.' });
  }

  try {
    const newPageData = await addPageToStory(storyId, { choiceNumber: choice, aiSessionId: session_id });
    res.status(201).json({ message: '페이지가 성공적으로 추가되었습니다.', data: newPageData });
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
