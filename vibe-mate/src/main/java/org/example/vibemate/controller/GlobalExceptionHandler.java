package org.example.vibemate.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.vibemate.dto.Response;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public Mono<ResponseEntity<Response>> handleIllegalArgumentException(IllegalArgumentException ex) {
        log.warn("Invalid argument: {}", ex.getMessage());
        Response errorResponse = new Response(ex.getMessage(), null, HttpStatus.BAD_REQUEST);
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse));
    }

    @ExceptionHandler(Exception.class)
    public Mono<ResponseEntity<Response>> handleGeneralException(Exception ex) {
        log.error("Unhandled exception: ", ex);
        Response errorResponse = new Response("Internal server error", null, HttpStatus.INTERNAL_SERVER_ERROR);
        return Mono.just(ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse));
    }

    @ExceptionHandler(DataAccessException.class)
    public Mono<ResponseEntity<Response>> handleDatabaseException(DataAccessException ex) {
        log.error("Database error: ", ex);
        Response errorResponse = new Response("Database error", null, HttpStatus.BAD_REQUEST);
        return Mono.just(ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse));
    }
}