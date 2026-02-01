package com.example.eventmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.AnswerRequest;
import com.example.eventmanagement.dto.QuestionRequest;
import com.example.eventmanagement.dto.QuestionResponse;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.service.QuestionAnswerService;

@CrossOrigin
@RestController
@RequestMapping("/qa")
public class QuestionAnswerController {

    @Autowired
    private QuestionAnswerService qaService;

    @PostMapping("/ask")
    public ResponseStructure<QuestionResponse> ask(@RequestBody QuestionRequest request) {
        return qaService.askQuestion(request);
    }

    @PostMapping("/answer")
    public ResponseStructure<QuestionResponse> answer(@RequestBody AnswerRequest request) {
        return qaService.answerQuestion(request);
    }

    @GetMapping("/view/{eventId}")
    public ResponseStructure<List<QuestionResponse>> view(@PathVariable int eventId) {
        return qaService.viewQuestions(eventId);
    }
}
