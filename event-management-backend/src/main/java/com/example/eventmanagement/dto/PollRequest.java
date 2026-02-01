package com.example.eventmanagement.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PollRequest {
    private String question;
    private LocalDateTime endsAt;
    private Integer eventId;
    private Integer createdBy;
    private List<String> options;
}
