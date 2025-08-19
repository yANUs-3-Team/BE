// 동화(Story) 관련 컨트롤러 (점진적 생성 방식)

import {
  startNewStory,
  addPageToStory,
  updateStoryTitle
} from '../services/stories.service.js';

/**
 *  새로운 동화 시작 컨트롤러
 */
export const startStoryController = async (req, res) => {
  const { userId } = req.user.id;
  if (!userId) {
    return res.status(400).json({ message: 'userId가 필요합니다.' });
  }

  try {
    const newStoryId = await startNewStory(userId);
    res.status(201).json({ message: '새로운 동화가 시작되었습니다.', storyId: newStoryId });
  } catch (error) {
    res.status(500).json({ message: error.message });
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
