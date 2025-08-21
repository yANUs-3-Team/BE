
import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout } from '../controllers/users.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// 회원가입 API
router.post(
  '/register',
  // 유효성 검사 미들웨어
  body('email').isEmail().withMessage('유효한 이메일 주소를 입력해주세요.'),
  body('password')
    .isLength({ min: 8 }).withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/) 
    .withMessage('비밀번호는 영문, 숫자, 특수문자를 모두 포함해야 합니다.'),
  body('name').notEmpty().withMessage('이름은 필수 항목입니다.'),
  body('username')
    .isLength({ min: 4 }).withMessage('사용자명은 최소 4자 이상이어야 합니다.')
    .isAlphanumeric().withMessage('사용자명은 영문과 숫자만 사용할 수 있습니다.'),
  body('birth').optional({ checkFalsy: true }).isISO8601().withMessage('생년월일은 YYYY-MM-DD 형식이어야 합니다.'),
  register
);

// 로그인 API
router.post('/login', login);

// 현재 사용자 정보 조회 API (인증 필요)
router.get('/me', verifyToken, getMe);

// 로그아웃 API
router.post('/logout', logout);

export default router;
