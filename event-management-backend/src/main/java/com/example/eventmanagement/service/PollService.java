package com.example.eventmanagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.PollOptionResponse;
import com.example.eventmanagement.dto.PollRequest;
import com.example.eventmanagement.dto.PollResponse;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.Poll;
import com.example.eventmanagement.model.PollOption;
import com.example.eventmanagement.model.PollVote;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.PollOptionRepository;
import com.example.eventmanagement.repository.PollRepository;
import com.example.eventmanagement.repository.PollVoteRepository;

@Service
public class PollService {

    @Autowired
    private PollRepository pollRepository;

    @Autowired
    private PollOptionRepository pollOptionRepository;

    @Autowired
    private PollVoteRepository pollVoteRepository;

    @Autowired
    private EventDao eventDao;

    @Autowired
    private UserDao userDao;

    public ResponseStructure<PollResponse> createPoll(PollRequest request) {
        Event event = eventDao.findEventById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        User creator = userDao.findVerifiedUserById(request.getCreatedBy())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Poll poll = Poll.builder()
                .question(request.getQuestion())
                .createdAt(LocalDateTime.now())
                .endsAt(request.getEndsAt())
                .event(event)
                .createdBy(creator)
                .build();

        poll = pollRepository.save(poll);

        for (String optionText : request.getOptions()) {
            PollOption option = PollOption.builder()
                    .optionText(optionText)
                    .poll(poll)
                    .build();
            pollOptionRepository.save(option);
        }

        return ResponseStructure.<PollResponse>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Poll created successfully")
                .data(convertToPollResponse(poll))
                .build();
    }

    public ResponseStructure<PollResponse> voteInPoll(int pollId, int optionId, int userId) {
        Poll poll = pollRepository.findById(pollId)
                .orElseThrow(() -> new RuntimeException("Poll not found"));

        if (poll.getEndsAt() != null && poll.getEndsAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Poll has ended");
        }

        User user = userDao.findVerifiedUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        PollOption option = pollOptionRepository.findById(optionId)
                .orElseThrow(() -> new RuntimeException("Option not found"));

        // Check if user already voted
        pollVoteRepository.findByPoll_PollIdAndUser_UserId(pollId, userId)
                .ifPresent(vote -> {
                    throw new RuntimeException("You have already voted in this poll");
                });

        PollVote vote = PollVote.builder()
                .poll(poll)
                .option(option)
                .user(user)
                .votedAt(LocalDateTime.now())
                .build();

        pollVoteRepository.save(vote);

        return ResponseStructure.<PollResponse>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Vote recorded successfully")
                .data(convertToPollResponse(poll))
                .build();
    }

    public ResponseStructure<List<PollResponse>> getEventPolls(int eventId) {
        List<Poll> polls = pollRepository.findByEvent_EventId(eventId);
        
        List<PollResponse> pollResponses = polls.stream()
                .map(this::convertToPollResponse)
                .collect(Collectors.toList());

        return ResponseStructure.<List<PollResponse>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event polls retrieved")
                .data(pollResponses)
                .build();
    }

    private PollResponse convertToPollResponse(Poll poll) {
        List<PollOption> options = pollOptionRepository.findByPoll_PollId(poll.getPollId());
        Long totalVotes = pollVoteRepository.countTotalVotesByPoll(poll.getPollId());
        
        List<PollOptionResponse> optionResponses = options.stream()
                .map(option -> {
                    Long votes = pollVoteRepository.countVotesByOption(option.getOptionId());
                    PollOptionResponse response = new PollOptionResponse();
                    response.setOptionId(option.getOptionId());
                    response.setOptionText(option.getOptionText());
                    response.setVotes(votes.intValue());
                    response.setPercentage(totalVotes > 0 ? (votes.doubleValue() / totalVotes) * 100 : 0);
                    return response;
                })
                .collect(Collectors.toList());

        PollResponse response = new PollResponse();
        response.setPollId(poll.getPollId());
        response.setQuestion(poll.getQuestion());
        response.setCreatedAt(poll.getCreatedAt());
        response.setEndsAt(poll.getEndsAt());
        response.setEventId(poll.getEvent().getEventId());
        response.setEventName(poll.getEvent().getEventName());
        response.setCreatedBy(poll.getCreatedBy().getUserId());
        response.setCreatorName(poll.getCreatedBy().getName());
        response.setOptions(optionResponses);
        response.setActive(poll.getEndsAt() == null || poll.getEndsAt().isAfter(LocalDateTime.now()));
        response.setTotalVotes(totalVotes.intValue());

        return response;
    }
}
