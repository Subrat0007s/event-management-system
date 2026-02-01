package com.example.eventmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForumPostRequest {
    private String title;
    private String content;
    private Integer eventId;
    private Integer userId; // Changed from authorId to match frontend
    
    // Backward compatibility
    public Integer getAuthorId() {
        return userId;
    }
}
