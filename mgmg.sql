-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    birth DATE,
    parentName VARCHAR(255),
    parentPhone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Articles Table
CREATE TABLE articles (
    article_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user _id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Article Comments Table
CREATE TABLE article_comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Story: 동화책 한 권을 의미
CREATE TABLE `Story` (
    `story_id`   INT NOT NULL AUTO_INCREMENT, -- 이 스토리의 고유 ID (자동 증가)
    `user_id`    INT NOT NULL,                -- 이 스토리를 만든 소유자 ID
    `title`      VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`story_id`), -- story_id가 이 테이블의 유일한 기본 키
    FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
);

-- Story_content: 동화책의 한 페이지를 의미
CREATE TABLE `Story_content` (
    `story_content_id` INT NOT NULL AUTO_INCREMENT, -- 이 페이지의 고유 ID (자동 증가)
    `story_id`         INT NOT NULL,                -- 이 페이지가 속한 스토리 ID
    `content`          TEXT NULL,                   -- 페이지 내용
    `img_url`          VARCHAR(255) NULL,           -- 페이지 이미지 URL
    PRIMARY KEY (`story_content_id`), -- story_content_id가 이 테이블의 유일한 기본 키
    FOREIGN KEY (`story_id`) REFERENCES `Story` (`story_id`) ON DELETE CASCADE -- 스토리가 삭제되면 페이지도 함께 삭제
);
