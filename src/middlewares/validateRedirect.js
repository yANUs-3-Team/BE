import { URL } from 'url';

// 허용할 도메인 목록 (Whitelist)
const ALLOWED_REDIRECT_HOSTS = [
  'example.com',
  'www.example.com'
];

export const validateRedirect = (req, res, next) => {
  const redirectUrl = req.query.url;

  // 리다이렉트 URL이 없으면 검증할 필요 없이 다음 미들웨어로 이동
  if (!redirectUrl) {
    return next();
  }

  try {
    const parsedUrl = new URL(redirectUrl);

    // 1. 프로토콜이 http 또는 https인지 확인하여 javascript: 같은 위험한 프로토콜 방지
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return res.status(400).send('유효하지 않은 프로토콜입니다.');
    }

    // 2. 호스트네임이 허용된 목록에 있는지 확인
    if (!ALLOWED_REDIRECT_HOSTS.includes(parsedUrl.hostname)) {
      return res.status(400).send('허용되지 않은 리다이렉트 도메인입니다.');
    }

    // 모든 검증을 통과한 경우에만 다음 미들웨어로 이동
    return next();

  } catch (e) {
    // new URL() 생성자에서 발생하는 에러 (잘못된 형식의 URL 등) 처리
    return res.status(400).send('유효하지 않은 형식의 URL입니다.');
  }
};