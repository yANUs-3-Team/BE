
import { createUser, findUserByEmail, findUserByUsername } from '../services/users.service.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// 회원가입 컨트롤러
export const register = async (req, res) => {
  // 1. 유효성 검사 결과 확인
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, username } = req.body;

  try {
    // 2. 이메일 또는 사용자명 중복 확인 (서비스 계층 호출 전)
    const existingUserByEmail = await findUserByEmail(email);
    if (existingUserByEmail) {
      return res.status(409).json({ message: '이미 존재하는 이메일입니다.' });
    }
    const existingUserByUsername = await findUserByUsername(username);
    if (existingUserByUsername) {
      return res.status(409).json({ message: '이미 존재하는 사용자명입니다.' });
    }

    // 3. 사용자 생성
    const newUser = await createUser(req.body);
    res.status(201).json({ message: '회원가입 성공', user: newUser });

  } catch (error) {
    console.error('Register Error:', error);

    // 4. 데이터베이스 에러 처리
    if (error.code === 'ER_DUP_ENTRY') {
      // 데이터베이스 레벨에서 중복이 발생한 경우 (동시 요청 등)
      return res.status(409).json({ message: '이메일 또는 사용자명이 이미 사용 중입니다.' });
    }

    res.status(500).json({ message: '서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
};

// 로그인 컨트롤러 (이메일 또는 사용자명으로 로그인)
export const login = async (req, res) => {
  const { loginId, password } = req.body; // loginId는 email 또는 username

  if (!loginId || !password) {
    return res.status(400).json({ message: '로그인 ID와 비밀번호를 입력해주세요.' });
  }

  try {
    // loginId가 이메일 형식인지 간단히 확인
    const isEmail = loginId.includes('@');
    const user = isEmail 
      ? await findUserByEmail(loginId) 
      : await findUserByUsername(loginId);

    if (!user) {
      return res.status(401).json({ message: '존재하지 않는 사용자입니다.' });
    }

    // 해시된 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // 토큰 유효기간 1시간
    );

    // 비밀번호를 제외한 사용자 정보 반환
    const userResponse = { ...user };
    delete userResponse.password;

    res.status(200).json({ 
      message: '로그인 성공', 
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
