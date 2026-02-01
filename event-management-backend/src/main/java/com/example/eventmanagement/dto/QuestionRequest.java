package com.example.eventmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionRequest {
    private String question;
    private Integer eventId;
    private Integer userId; // Changed from askedBy to match frontend
    
    // Explicit getters to ensure they exist
    public String getQuestion() {
        return question;
    }
    
    public Integer getEventId() {
        return eventId;
    }
    
    public Integer getUserId() {
        return userId;
    }
    
    // Deprecated method for backward compatibility during transition
    @Deprecated
    public Integer getAskedBy() {
        return userId;
    }
}
