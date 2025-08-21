import jwt from 'jsonwebtoken';
import { findUserByUsername } from '../services/users.service.js';

export const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    if (!authorization) {
      return res.status(401).json({ message: '인증 토큰이 없습니다. 로그인이 필요합니다.' });
    }

    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer' || !token) {
      return res.status(401).json({ message: '유효하지 않은 토큰 형식입니다.' });
    }

    // 토큰에서 username을 기준으로 사용자 정보 확인
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const username = decodedToken.username;

    const user = await findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: '토큰 사용자가 존재하지 않습니다.' });
    }

    // req 객체에 사용자 정보 저장
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '토큰이 만료되었습니다. 다시 로그인해주세요.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '토큰이 조작되었습니다.' });
    }
    console.error('Token Verification Error:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
