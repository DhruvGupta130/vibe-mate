package org.example.vibemate.service;

import org.example.vibemate.dto.BotConfig;
import org.example.vibemate.dto.ChatRequest;
import org.example.vibemate.dto.UserInfo;
import org.springframework.ai.chat.messages.Message;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Service
public interface ChatService {
    Flux<String> getChatResponse(BotConfig bot, UserInfo user, ChatRequest chatRequest);
    Mono<String> extractTextFromBuffer(DataBuffer dataBuffer);
    Flux<String> askOllamaAboutText(BotConfig bot, UserInfo user, String extractedText, ChatRequest request);
    Flux<String> describeImageWithContext(byte[] imageBytes, ChatRequest request);
    List<Message> chatMemory(UUID id);
    Mono<Void> clearMemory(UUID id);
}
