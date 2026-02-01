package com.example.eventmanagement.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfiguration {

    private String to;
    private String subject;
    private String body;
}
