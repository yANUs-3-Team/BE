
import { createUser, findUserByEmail, findUserByUsername } from '../services/users.service.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

/**
 * 회원가입
 */
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

/**
 * 로그인
 */
export const login = async (req, res) => {
  console.log('로그인 요청 확인:', req.body);
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: '사용자명과 비밀번호를 입력해주세요.' });
  }

  try {
    const user = await findUserByUsername(username);

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
      { id: user.user_id, email: user.email, username: user.username }, // 사용자 정보 포함
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // 토큰 유효기간 1시간
    );

    // 비밀번호를 제외한 사용자 정보 반환
    const userResponse = { ...user };
    delete userResponse.password;

    // JWT를 HttpOnly, Secure, SameSite 옵션을 적용한 쿠키로 설정
    res.cookie('accessToken', token, {
      httpOnly: true, // Javascript에서 쿠키에 접근 불가 (XSS 방어)
      secure: process.env.NODE_ENV === 'production', // 프로덕션 환경(배포 후)에서만 HTTPS 강제
      sameSite: 'None', // 다른 도메인 간의 통신을 위한 설정
      path: '/', // 쿠키 경로 설정
      maxAge: 60 * 60 * 1000 // 쿠키 유효기간 1시간 (밀리초 단위)
    });

    // 응답에서는 토큰을 제외하고 성공 메시지와 사용자 정보만 전달
    res.status(200).json({ 
      message: '로그인 성공', 
      user: userResponse
    });

  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
