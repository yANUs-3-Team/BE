# 🌟 몽글몽글 상상나래 (MGMG-BackEnd)

본 리포지토리 구축된 백엔드 API 서버입니다. 사용자 인증(회원가입, 로그인) 및 게시글 관련 기능, 동화 저장 관련 기능을 제공합니다.

## ✨ 주요 기능

- **사용자 관리**
  - 회원가입 (Bcrypt 암호화)
  - 로그인 (JWT 토큰 발급)
- **게시글 및 댓글**
  - 게시글 CRUD
  - 댓글 CRUD
- **동화 생성**
  - 상호작용을 통한 페이지 단위 동화 생성
  - 최종 동화 제목 설정

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