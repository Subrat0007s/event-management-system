package com.example.eventmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.ForumCommentRequest;
import com.example.eventmanagement.dto.ForumCommentResponse;
import com.example.eventmanagement.dto.ForumPostRequest;
import com.example.eventmanagement.dto.ForumPostResponse;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.service.ForumService;

@RestController
@RequestMapping("/api/forum")
@CrossOrigin
public class ForumController {

    @Autowired
    private ForumService forumService;

    @PostMapping("/posts")
    public ResponseStructure<ForumPostResponse> createPost(@RequestBody ForumPostRequest request) {
        return forumService.createPost(request);
    }

    @PostMapping("/comments")
    public ResponseStructure<ForumCommentResponse> addComment(@RequestBody ForumCommentRequest request) {
        return forumService.addComment(request);
    }

    @GetMapping("/posts/event/{eventId}")
    public ResponseStructure<List<ForumPostResponse>> getEventPosts(@PathVariable int eventId) {
        return forumService.getEventPosts(eventId);
    }

    @GetMapping("/posts/{postId}")
    public ResponseStructure<ForumPostResponse> getPostWithComments(@PathVariable int postId) {
        return forumService.getPostWithComments(postId);
    }
}
