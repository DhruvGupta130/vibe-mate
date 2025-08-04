package org.example.vibemate.dto;

import java.util.UUID;

public record ChatRequest(UUID userId, String message) {}

