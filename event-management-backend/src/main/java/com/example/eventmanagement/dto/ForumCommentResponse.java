package com.example.eventmanagement.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForumCommentResponse {
    private int commentId;
    private String content;
    private LocalDateTime createdAt;
    private int postId;
    private String postTitle;
    private int authorId;
    private String authorName;
}
