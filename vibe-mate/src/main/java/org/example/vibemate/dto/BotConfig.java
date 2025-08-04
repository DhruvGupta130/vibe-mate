package org.example.vibemate.dto;

import lombok.Builder;
import org.example.vibemate.model.Bot;

import java.util.UUID;

@Builder
public record BotConfig(
        UUID userId,
        String botName,
        String personality,
        String tone,
        String role
) {
    public BotConfig(Bot bot) {
        this(
                bot.getUserId(),
                bot.getBotName(),
                bot.getPersonality(),
                bot.getTone(),
                bot.getRole()
        );
    }
}
