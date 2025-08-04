package org.example.vibemate.dto;

import org.springframework.http.HttpStatus;

public record Response(String message, Object data, HttpStatus status) {}
