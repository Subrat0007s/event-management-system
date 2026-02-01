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
public class ForumPostResponse {
    private int postId;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int eventId;
    private String eventName;
    private int authorId;
    private String authorName;
    private List<ForumCommentResponse> comments;
    private int commentCount;
}
