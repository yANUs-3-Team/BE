# 🌟 Express.js 기반 백엔드 API 서버

본 프로젝트는 Express.js와 MySQL을 사용하여 구축된 백엔드 API 서버입니다. 사용자 인증(회원가입, 로그인) 및 게시글 관련 기능을 제공합니다.

## ✨ 주요 기능

- **사용자 관리**
  - 회원가입 (Bcrypt 암호화)
  - 로그인 (JWT 토큰 발급)
- **게시글 및 댓글** (구현 예정)
  - 게시글 CRUD
  - 댓글 CRUD

## 🛠️ 기술 스택

| 구분 | 기술 |
| --- | --- |
| **Framework** | Express.js |
| **Database** | MySQL (mysql2) |
| **Authentication** | JSON Web Token (jsonwebtoken), Bcrypt |
| **Validation** | express-validator |
| **Environment** | dotenv |
| **CORS** | cors |
| **Language** | JavaScript (ESM) |

## 📂 프로젝트 구조

```
BE/
├── app.js              # Express 서버 메인 파일
├── package.json        # 프로젝트 의존성 및 스크립트 관리
├── .env                # 환경 변수 설정 파일 (Git 추적 제외)
├── .gitignore          # Git 추적 제외 파일 목록
├── mgmg.db.sql         # 데이터베이스 테이블 생성 SQL
└── src/
    ├── api/
    │   └── users.routes.js     # 사용자 관련 API 라우트 정의
    ├── config/
    │   └── database.js         # 데이터베이스 연결 설정
    ├── controllers/
    │   └── users.controller.js # API 요청 처리 로직 (Controller)
    └── services/
        └── users.service.js    # 비즈니스 로직 및 DB 연동 (Service)
```

## 🚀 시작하기

### 1. 사전 준비

- [Node.js](https://nodejs.org/ko/) (v18 이상 권장)
- [MySQL](https://dev.mysql.com/downloads/mysql/)

### 2. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 클론
git clone https://github.com/yANUs-3-Team/BE.git

# 디렉토리 이동
cd BE

# 의존성 패키지 설치
npm install
```

### 3. 데이터베이스 설정

1.  MySQL에 접속하여 프로젝트에서 사용할 데이터베이스를 생성합니다.

    ```sql
    CREATE DATABASE your_database_name;
    ```

2.  `mgmg.db.sql` 파일의 내용을 실행하여 필요한 테이블(`users`, `articles`, `article_comments`)을 생성합니다.

### 4. 환경 변수 설정

프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 참고하여 작성합니다. **(보안을 위해 `.env` 파일은 Git에 포함되지 않습니다.)**

```env
# 서버 포트
PORT=3000

# 데이터베이스 연결 정보
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_database_name

# JWT 시크릿 키 (매우 중요)
# 예측 불가능한 긴 문자열로 설정하세요.
JWT_SECRET=your_very_secret_and_long_key
```

### 5. 서버 실행

```bash
npm start
```

서버가 정상적으로 실행되면 콘솔에 `서버가 http://localhost:3000 에서 실행 중입니다.` 메시지가 출력됩니다.

## 📝 API 명세

### `/api/users`

#### `POST /register` - 회원가입

-   **Description**: 새로운 사용자를 등록합니다.
-   **Request Body**:

| Key | Type | Description | Required |
| --- | --- | --- | :---: |
| `email` | String | 유효한 이메일 주소 | O |
| `password` | String | 비밀번호 (최소 8자, 영문/숫자/특수문자 포함) | O |
| `name` | String | 사용자 이름 | O |
| `username` | String | 사용자명 (최소 4자, 영문/숫자) | O |
| `birth` | String | 생년월일 (YYYY-MM-DD) | X |
| `parentName` | String | 보호자 이름 | X |
| `parentPhone` | String | 보호자 연락처 | X |

-   **Success Response (201)**:
    ```json
    {
      "message": "회원가입 성공",
      "user": {
        "email": "test@example.com",
        "name": "테스트",
        "username": "testuser",
        "birth": "2000-01-01",
        "id": 1
      }
    }
    ```
-   **Error Response**:
    -   `400 Bad Request`: 유효성 검사 실패
    -   `409 Conflict`: 이메일 또는 사용자명 중복

#### `POST /login` - 로그인

-   **Description**: 사용자명과 비밀번호로 로그인하고 JWT 토큰을 발급받습니다.
-   **Request Body**:

| Key | Type | Description | Required |
| --- | --- | --- | :---: |
| `username` | String | 사용자명 | O |
| `password` | String | **[중요]** 평문 비밀번호 | O |

-   **Success Response (200)**:
    ```json
    {
      "message": "로그인 성공",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "email": "test@example.com",
        "username": "testuser"
      }
    }
    ```
-   **Error Response**:
    -   `400 Bad Request`: 필수 정보 누락
    -   `401 Unauthorized`: 사용자 정보 불일치

---