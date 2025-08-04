CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255),
    age INT,
    gender VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS bot (
    user_id UUID PRIMARY KEY,
    bot_name VARCHAR(255),
    personality TEXT,
    tone VARCHAR(100),
    role VARCHAR(255),
    CONSTRAINT fk_bot_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS SPRING_AI_CHAT_MEMORY (
    chat_id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS SPRING_AI_CHAT_MEMORY_CONVERSATION_ID_TIMESTAMP_IDX
    ON SPRING_AI_CHAT_MEMORY (conversation_id, timestamp);
