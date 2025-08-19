//JWT 인증 관련
import jwt from 'jsonwebtoken';

/**
 * JWT 인증 미들웨어
 */
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 토큰에서 사용자 정보 추출
    next();
  } catch (err) {
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};

//TODO: TLS 사용
// 1. HTTPS 프로토콜 사용
// 2. SSL 인증서 발급 및 적용
// 3. 모든 API 요청에 대해 HTTPS 강제
//TODO2: 사용자 입력 신뢰하지 않음. 오픈 리다이렉트 방지
// 1. 사용자 입력 검증 및 정제
// 2. 신뢰할 수 없는 URL로의 리다이렉트 방지


