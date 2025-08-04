package org.example.vibemate.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.util.UUID;

@Table("users")
@Getter
@Setter
public class User {

    @Id
    private UUID userId;
    private String fullName;
    private Integer age;
    private String gender;
}
