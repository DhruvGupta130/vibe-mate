package org.example.vibemate.controller;

import lombok.RequiredArgsConstructor;
import org.example.vibemate.service.ChatService;
import org.example.vibemate.service.UserService;
import org.springframework.ai.chat.messages.Message;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.http.MediaType;
import org.springframework.http.codec.multipart.FilePart;
import org.springframework.web.bind.annotation.*;
import org.example.vibemate.dto.ChatRequest;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class ChatController {


    private final UserService userService;
    private final ChatService chatService;

    @PostMapping(produces = MediaType.TEXT_MARKDOWN_VALUE)
    public Flux<String> chat(@RequestBody ChatRequest request) {
        return Mono.zip(
                        userService.getUser(request.userId()),
                        userService.getBotConfig(request.userId())
                )
                .flatMapMany(tuple ->
                        chatService.getChatResponse(tuple.getT2(), tuple.getT1(), request));
    }

    @PostMapping(value = "/upload")
    public Flux<String> handleUpload(
            @RequestPart("file") FilePart filePart,
            @RequestPart("userId") String userId,
            @RequestPart("message") String message
    ) {
        ChatRequest request = new ChatRequest(UUID.fromString(userId), message);
        return DataBufferUtils.join(filePart.content())
                .flatMap(chatService::extractTextFromBuffer)
                .flatMapMany(content -> Mono.zip(
                        userService.getUser(request.userId()),
                        userService.getBotConfig(request.userId())
                ).flatMapMany(tuple -> chatService.askOllamaAboutText(tuple.getT2(), tuple.getT1(), content, request)));
    }

    @PostMapping(value = "/vision")
    public Flux<String> handleVision(
            @RequestPart("file") FilePart filePart,
            @RequestPart("userId") String userId,
            @RequestPart("message") String message
    ) {
        ChatRequest chatRequest = new ChatRequest(UUID.fromString(userId), message);
        return DataBufferUtils.join(filePart.content())
                .map(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    DataBufferUtils.release(dataBuffer);
                    return bytes;
                })
                .flatMapMany(imageBytes ->
                        chatService.describeImageWithContext(imageBytes, chatRequest));
    }

    @PostMapping("/memory")
    public List<Message> getChatMemory(@RequestBody ChatRequest request) {
        return chatService.chatMemory(request.userId());
    }

    @DeleteMapping("/clear")
    public Mono<Void> clearChatMemory(@RequestBody ChatRequest request) {
        return chatService.clearMemory(request.userId());
    }

}

