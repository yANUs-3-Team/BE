
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

    // JWT 토큰 생성 (ID로 username 사용)
    const token = jwt.sign(
      { username: user.username, email: user.email }, // id 대신 username을 토큰에 저장
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // 토큰 유효기간 1시간
    );

    // 비밀번호를 제외한 사용자 정보 반환
    const userResponse = { ...user };
    delete userResponse.password;

    // JWT를 HttpOnly, Secure, SameSite 옵션을 적용한 쿠키로 설정
    const cookieOptions = {
      httpOnly: true,
      secure: true, // 프론트엔드가 HTTPS를 사용하므로 항상 true
      sameSite: 'None', // secure: true가 필수
      path: '/',
      maxAge: 60 * 60 * 1000
    };

    // --- DEBUGGING LOGS ---
    console.log('--- Cookie Debugging ---');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Cookie Options:', cookieOptions);
    console.log('Setting cookie and sending response...');
    // --- END DEBUGGING LOGS ---

    res.cookie('authorization', `Bearer ${token}`, cookieOptions);

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

/**
 * 현재 로그인된 사용자 정보 조회
 */
export const getMe = async (req, res) => {
  try {
    // auth.middleware에서 이미 사용자 정보를 조회하여 res.locals.user에 저장했음
    const user = res.locals.user;

    if (!user) {
      // 이 경우는 auth.middleware를 통과했는데도 사용자가 없는 경우로, 이론상 발생하기 어려움
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    // 비밀번호 등 민감한 정보 제외
    const { password, ...userResponse } = user;

    res.status(200).json({ user: userResponse });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};

/**
 * 로그아웃
 */
export const logout = (req, res) => {
  try {
    // 'authorization' 쿠키를 지웁니다.
    // 쿠키의 값을 비우고, maxAge를 0으로 설정하여 즉시 만료시킵니다.
    res.cookie('authorization', '', {
      httpOnly: true,
      secure: true, // 쿠키 설정 시와 동일한 옵션
      sameSite: 'None', // 쿠키 설정 시와 동일한 옵션
      path: '/',
      maxAge: 0
    });

    res.status(200).json({ message: '로그아웃 성공' });
  } catch (error) {
    console.error('Logout Error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
};
