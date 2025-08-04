package org.example.vibemate.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("bot")
@Getter
@Setter
public class Bot {

    @Id
    private UUID userId;
    private String botName;
    private String personality;
    private String tone;
    private String role;
}

