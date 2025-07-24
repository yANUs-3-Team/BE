 # Express.js 기반 백엔드 API 서버
    
    본 프로젝트는 Express.js를 사용하여 구축된 백엔드 API
     서버입니다. 사용자 인증(회원가입, 로그인) 기능을 제공합니다.
    
    ## 주요 기능
    
    -   **회원가입**: 새로운 사용자를 등록합니다.
    -   **로그인**: 이메일 또는 사용자명으로 로그인하고 JWT 토큰을
    발급받습니다.
    
   ## 기술 스택
   
   -   **프레임워크**: Express.js
   -   **데이터베이스**: MySQL (mysql2)
   -   **인증**: JSON Web Token (jsonwebtoken), bcrypt
   -   **유효성 검사**: express-validator
   -   **환경 변수 관리**: dotenv
   -   **CORS 처리**: cors
   
   ## 프로젝트 구조
  .
  ├── app.js              # Express 서버 메인 파일
  ├── package.json        # 프로젝트 의존성 및 스크립트 관리
  ├── .env                # 환경 변수 설정 파일
  ├── .gitignore          # Git 추적 제외 파일 목록
  └── src
      ├── api
      │   └── users.routes.js     # 사용자 관련 API 라우트 정의
      ├── config
      │   └── database.js         # 데이터베이스 연결 설정
      ├── controllers
      │   └── users.controller.js # API 요청 처리 로직
      └── services
          └── users.service.js    # 비즈니스 로직 및 데이터베이스 연동

    
   ## API 엔드포인트
    
   ### 사용자 (Users)
    
   -   **`POST /api/users/register`**: 회원가입
        -   **Request Body**:
           -   `email` (string, required): 이메일
           -   `password` (string, required): 비밀번호 (최소 8자,
   영문/숫자/특수문자 포함)
           -   `name` (string, required): 이름
           -   `username` (string, required): 사용자명 (최소 4자,
   영문/숫자)
           -   `birth` (string, optional): 생년월일 (YYYY-MM-DD)
   -   **`POST /api/users/login`**: 로그인
       -   **Request Body**:
           -   `loginId` (string, required): 이메일 또는 사용자명
           -   `password` (string, required): 비밀번호
   
   ## 설치 및 실행
   
   1.  **저장소 복제**:
   git clone https://github.com/yANUs-3-Team/BE.git
   cd BE
  
   2.  **의존성 설치**:
   npm install
    
   1
   2 서버는 `http://localhost:3000` 에서 실행됩니다.
