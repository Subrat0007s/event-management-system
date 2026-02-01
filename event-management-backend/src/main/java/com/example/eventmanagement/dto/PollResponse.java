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
public class PollResponse {
    private int pollId;
    private String question;
    private LocalDateTime createdAt;
    private LocalDateTime endsAt;
    private int eventId;
    private String eventName;
    private int createdBy;
    private String creatorName;
    private List<PollOptionResponse> options;
    private boolean active;
    private int totalVotes;
}
