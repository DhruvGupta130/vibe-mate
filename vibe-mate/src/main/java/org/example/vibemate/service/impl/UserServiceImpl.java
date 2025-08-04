package org.example.vibemate.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.vibemate.dto.BotConfig;
import org.example.vibemate.dto.Response;
import org.example.vibemate.dto.UserInfo;
import org.example.vibemate.model.Bot;
import org.example.vibemate.model.User;
import org.example.vibemate.repository.BotConfigRepo;
import org.example.vibemate.repository.UserRepo;
import org.example.vibemate.service.UserService;
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepository;
    private final BotConfigRepo botConfigRepository;
    private final R2dbcEntityTemplate r2dbcEntityTemplate;

    @Override
    public Mono<Response> saveUser(User user) {
        if (user.getUserId() != null) {
            return userRepository.findById(user.getUserId())
                    .flatMap(existing -> userRepository.save(user))
                    .map(saved -> new Response("Successfully Updated Profile", saved, HttpStatus.OK));
        }
        return r2dbcEntityTemplate.insert(User.class)
                .using(user)
                .map(saved -> new Response("Successfully Added Profile", saved, HttpStatus.CREATED));
    }

    @Override
    public Mono<Response> saveBotConfig(Bot bot) {
        if (bot.getUserId() == null) throw new IllegalArgumentException("User Id is missing");
        return botConfigRepository.findById(bot.getUserId())
                .flatMap(existing -> botConfigRepository.save(bot))
                .switchIfEmpty(r2dbcEntityTemplate.insert(bot))
                .map(data -> new Response("AI setting updated", data, HttpStatus.ACCEPTED));
    }

    @Override
    public Mono<UserInfo> getUser(UUID userId) {
        return userRepository.findById(userId).map(UserInfo::new);
    }

    @Override
    public Mono<BotConfig> getBotConfig(UUID userId) {
        return botConfigRepository.findById(userId).map(BotConfig::new);
    }
}
