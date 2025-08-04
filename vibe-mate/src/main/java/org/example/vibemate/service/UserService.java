package org.example.vibemate.service;

import org.example.vibemate.dto.BotConfig;
import org.example.vibemate.dto.Response;
import org.example.vibemate.dto.UserInfo;
import org.example.vibemate.model.Bot;
import org.example.vibemate.model.User;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
public interface UserService {
    Mono<Response> saveUser(User user);
    Mono<Response> saveBotConfig(Bot bot);
    Mono<UserInfo> getUser(UUID userId);
    Mono<BotConfig> getBotConfig(UUID userId);
}

