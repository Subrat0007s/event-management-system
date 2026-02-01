package com.example.eventmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequest {
    private String answer;
    private Integer qaId;
    private Integer creatorId; // Changed from answeredBy to match frontend
    
    // Explicit getters to ensure they exist
    public String getAnswer() {
        return answer;
    }
    
    public Integer getQaId() {
        return qaId;
    }
    
    public Integer getCreatorId() {
        return creatorId;
    }
    
    // Deprecated method for backward compatibility during transition
    @Deprecated
    public Integer getAnsweredBy() {
        return creatorId;
    }
}
