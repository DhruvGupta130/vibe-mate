package org.example.vibemate.service.impl;

import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.example.vibemate.dto.BotConfig;
import org.example.vibemate.dto.ChatRequest;
import org.example.vibemate.dto.UserInfo;
import org.example.vibemate.service.ChatService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.vectorstore.QuestionAnswerAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.ai.ollama.api.OllamaModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatClient chatClient;
    private final ChatMemory chatMemory;
    private final VectorStore vectorStore;

    @Override
    public Flux<String> getChatResponse(BotConfig bot, UserInfo user, ChatRequest request) {
        String systemPrompt = getSystemPrompt(bot, user);
        return chatClient.prompt()
                .advisors(
                        MessageChatMemoryAdvisor
                                .builder(chatMemory)
                                .conversationId(request.userId().toString())
                                .build(),
                        QuestionAnswerAdvisor
                                .builder(vectorStore)
                                .searchRequest(SearchRequest.builder().build())
                                .build()
                )
                .system(systemPrompt)
                .user(request.message())
                .stream()
                .content();
    }

    @Override
    public Mono<String> extractTextFromBuffer(DataBuffer dataBuffer) {
        return Mono.fromCallable(() -> {
            byte[] bytes = new byte[dataBuffer.readableByteCount()];
            dataBuffer.read(bytes);
            DataBufferUtils.release(dataBuffer); // Release buffer memory
            try (InputStream inputStream = new ByteArrayInputStream(bytes)) {
                Tika tika = new Tika();
                return tika.parseToString(inputStream);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }

    @Override
    public Flux<String> askOllamaAboutText(BotConfig bot, UserInfo user, String extractedText, ChatRequest request) {
        String systemPrompt = getSystemPrompt(bot, user);
        return chatClient.prompt()
                .advisors(
                        MessageChatMemoryAdvisor
                                .builder(chatMemory)
                                .conversationId(request.userId().toString())
                                .build()
                )
                .system(systemPrompt)
                .user(request.message() + extractedText)
                .stream()
                .content();
    }

    @Override
    public Flux<String> describeImageWithContext(byte[] imageBytes, ChatRequest request) {
        return Mono.fromCallable(() -> {
                    String mimeType = URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(imageBytes));
                    if (!"image/jpeg".equalsIgnoreCase(mimeType) && !"image/png".equalsIgnoreCase(mimeType) && !"image/gif".equalsIgnoreCase(mimeType)) {
                        throw new IllegalArgumentException("Only JPEG and PNG images are supported.");
                    }
                    return imageBytes;
                })
                .subscribeOn(Schedulers.boundedElastic())
                .flatMapMany(validBytes -> {
                    Resource resource = new ByteArrayResource(validBytes);

                    Message userMessage = UserMessage
                            .builder()
                            .media(
                                    new Media(MimeTypeUtils.IMAGE_PNG, resource),
                                    new Media(MimeTypeUtils.IMAGE_JPEG, resource),
                                    new Media(MimeTypeUtils.IMAGE_GIF, resource)
                            )
                            .text(request.message())
                            .build();

                    ChatOptions chatOptions = OllamaOptions.builder()
                            .model(OllamaModel.LLAVA)
                            .build();

                    return chatClient
                            .prompt(new Prompt(userMessage, chatOptions))
                            .advisors(
                                    MessageChatMemoryAdvisor
                                            .builder(chatMemory)
                                            .conversationId(request.userId().toString())
                                            .build()
                            )
                            .stream()
                            .content();
                });
    }

    @Override
    public List<Message> chatMemory(UUID id) {
        return chatMemory.get(id.toString());
    }

    @Override
    public Mono<Void> clearMemory(UUID id) {
        return Mono.fromRunnable(() -> chatMemory.clear(id.toString()));
    }

    private String getSystemPrompt(BotConfig bot, UserInfo user) {
        String userAge = user.age() != null ? user.age().toString() : "unknown age";
        String userGender = user.gender() != null ? user.gender() : "user";
        String botRole = bot.role() != null ? bot.role() : "companion";

        return """
                You are %s — my %s. Your tone is %s and your personality is %s.
                You're chatting with %s, a %s-year-old %s.
                Be helpful, warm, and responsive in our conversations.
                Speak in a witty, humorous way without being offensive. Keep things casual but smart.
                """.formatted(
                bot.botName(),
                botRole,
                bot.tone(),
                bot.personality(),
                user.fullName(),
                userAge,
                userGender
        );
    }
}
