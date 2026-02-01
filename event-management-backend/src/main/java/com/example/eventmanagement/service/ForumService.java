package com.example.eventmanagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.ForumCommentRequest;
import com.example.eventmanagement.dto.ForumCommentResponse;
import com.example.eventmanagement.dto.ForumPostRequest;
import com.example.eventmanagement.dto.ForumPostResponse;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.ForumComment;
import com.example.eventmanagement.model.ForumPost;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.ForumCommentRepository;
import com.example.eventmanagement.repository.ForumPostRepository;

@Service
public class ForumService {

    @Autowired
    private ForumPostRepository forumPostRepository;

    @Autowired
    private ForumCommentRepository forumCommentRepository;

    @Autowired
    private EventDao eventDao;

    @Autowired
    private UserDao userDao;

    public ResponseStructure<ForumPostResponse> createPost(ForumPostRequest request) {
        Event event = eventDao.findEventById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Try both userId and authorId for compatibility
        Integer authorId = request.getUserId();
        if (authorId == null) {
            authorId = request.getAuthorId();
        }

        User author = userDao.findVerifiedUserById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ForumPost post = ForumPost.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .event(event)
                .author(author)
                .build();

        post = forumPostRepository.save(post);

        return ResponseStructure.<ForumPostResponse>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Forum post created successfully")
                .data(convertToPostResponse(post))
                .build();
    }

    public ResponseStructure<ForumCommentResponse> addComment(ForumCommentRequest request) {
        ForumPost post = forumPostRepository.findById(request.getPostId())
                .orElseThrow(() -> new RuntimeException("Post not found"));

        User author = userDao.findVerifiedUserById(request.getAuthorId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        ForumComment comment = ForumComment.builder()
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .post(post)
                .author(author)
                .build();

        comment = forumCommentRepository.save(comment);

        return ResponseStructure.<ForumCommentResponse>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Comment added successfully")
                .data(convertToCommentResponse(comment))
                .build();
    }

    public ResponseStructure<List<ForumPostResponse>> getEventPosts(int eventId) {
        List<ForumPost> posts = forumPostRepository.findByEventIdOrderByCreatedAtDesc(eventId);
        
        List<ForumPostResponse> postResponses = posts.stream()
                .map(this::convertToPostResponse)
                .collect(Collectors.toList());

        return ResponseStructure.<List<ForumPostResponse>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event forum posts retrieved")
                .data(postResponses)
                .build();
    }

    public ResponseStructure<ForumPostResponse> getPostWithComments(int postId) {
        ForumPost post = forumPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        return ResponseStructure.<ForumPostResponse>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Post with comments retrieved")
                .data(convertToPostResponse(post))
                .build();
    }

    private ForumPostResponse convertToPostResponse(ForumPost post) {
        List<ForumComment> comments = forumCommentRepository.findByPostIdOrderByCreatedAtAsc(post.getPostId());
        
        List<ForumCommentResponse> commentResponses = comments.stream()
                .map(this::convertToCommentResponse)
                .collect(Collectors.toList());

        ForumPostResponse response = new ForumPostResponse();
        response.setPostId(post.getPostId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setEventId(post.getEvent().getEventId());
        response.setEventName(post.getEvent().getEventName());
        response.setAuthorId(post.getAuthor().getUserId());
        response.setAuthorName(post.getAuthor().getName());
        response.setComments(commentResponses);
        response.setCommentCount(comments.size());

        return response;
    }

    private ForumCommentResponse convertToCommentResponse(ForumComment comment) {
        ForumCommentResponse response = new ForumCommentResponse();
        response.setCommentId(comment.getCommentId());
        response.setContent(comment.getContent());
        response.setCreatedAt(comment.getCreatedAt());
        response.setPostId(comment.getPost().getPostId());
        response.setPostTitle(comment.getPost().getTitle());
        response.setAuthorId(comment.getAuthor().getUserId());
        response.setAuthorName(comment.getAuthor().getName());

        return response;
    }
}
