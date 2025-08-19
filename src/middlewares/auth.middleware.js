import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  // 요청의 쿠키에서 accessToken을 가져옵니다.
  const token = req.cookies.accessToken;

  // 토큰이 없는 경우
  if (!token) {
    return res.status(401).json({ message: '인증 토큰이 없습니다. 로그인이 필요합니다.' });
  }

  try {
    // JWT 토큰을 검증합니다.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 검증된 사용자 정보를 req 객체에 추가하여 다음 미들웨어나 라우트 핸들러로 전달합니다.
    req.user = decoded;
    next();

  } catch (error) {
    // 토큰 검증 실패 시 (만료, 위조 등)
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: '토큰이 만료되었습니다. 다시 로그인해주세요.' });
    }
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
