package org.example.vibemate.dto;

import org.example.vibemate.model.User;

import java.util.UUID;

public record UserInfo(
        UUID userId,
        String fullName,
        Integer age,
        String gender
) {
    public UserInfo(User user) {
        this(
                user.getUserId(),
                user.getFullName(),
                user.getAge(),
                user.getGender()
        );
    }
}
