package org.example.vibemate.controller;

import lombok.RequiredArgsConstructor;
import org.example.vibemate.dto.BotConfig;
import org.example.vibemate.dto.Response;
import org.example.vibemate.dto.UserInfo;
import org.example.vibemate.model.Bot;
import org.example.vibemate.model.User;
import org.example.vibemate.service.UserService;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PostMapping("/info")
    public Mono<Response> saveUserInfo(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PostMapping("/bot")
    public Mono<Response> saveBotConfig(@RequestBody Bot bot) {
        return userService.saveBotConfig(bot);
    }

    @GetMapping("/{userId}")
    public Mono<UserInfo> getUser(@PathVariable UUID userId) {
        return userService.getUser(userId);
    }

    @GetMapping("/bot/{userId}")
    public Mono<BotConfig> getBot(@PathVariable UUID userId) {
        return userService.getBotConfig(userId);
    }
}


