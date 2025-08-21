// 사용자 관련 서비스

import pool from '../config/database.js';
import bcrypt from 'bcrypt';

const saltRounds = 10; // 암호화 복잡도


/**
 *  이메일로 사용자 찾기
 */
export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await pool.query(query, [email]);
  return rows[0];
};

/**
 *  사용자명으로 사용자 찾기
 */
export const findUserByUsername = async (username) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  const [rows] = await pool.query(query, [username]);
  
  // 결과 배열의 첫 번째 요소를 반환합니다. 결과가 없으면 undefined가 반환됩니다.
  return rows[0];
};



/**
 *  사용자 생성 (트랜잭션 적용)
 */
export const createUser = async (userData) => {
  const { email, password, name, username, birth, parentName, parentPhone } = userData;
  const connection = await pool.getConnection(); // 커넥션 풀에서 커넥션 가져오기

  try {
    await connection.beginTransaction(); // 트랜잭션 시작

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (email, password, name, username, birth, parentName, parentPhone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [email, hashedPassword, name, username, birth, parentName, parentPhone];

    const [result] = await connection.query(query, params);
    
    await connection.commit(); // 모든 쿼리 성공 시 커밋

    // 새로 생성된 사용자 정보에서 비밀번호를 제외하고 반환
    const newUser = { ...userData };
    delete newUser.password;
    newUser.id = result.insertId;

    return newUser;

  } catch (error) {
    await connection.rollback(); // 오류 발생 시 롤백
    throw error; // 에러를 상위로 전파하여 컨트롤러에서 처리

  } finally {
    connection.release(); // 사용한 커넥션 반환
  }
};
