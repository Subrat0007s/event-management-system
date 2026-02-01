package com.example.eventmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.PollRequest;
import com.example.eventmanagement.dto.PollResponse;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.service.PollService;

@RestController
@RequestMapping("/polls")
@CrossOrigin
public class PollController {

    @Autowired
    private PollService pollService;

    @PostMapping("/create")
    public ResponseStructure<PollResponse> createPoll(@RequestBody PollRequest request) {
        return pollService.createPoll(request);
    }

    @PostMapping("/vote")
    public ResponseStructure<PollResponse> voteInPoll(
            @RequestParam int pollId,
            @RequestParam int optionId,
            @RequestParam int userId) {
        return pollService.voteInPoll(pollId, optionId, userId);
    }

    @GetMapping("/event/{eventId}")
    public ResponseStructure<List<PollResponse>> getEventPolls(@PathVariable int eventId) {
        return pollService.getEventPolls(eventId);
    }
}
