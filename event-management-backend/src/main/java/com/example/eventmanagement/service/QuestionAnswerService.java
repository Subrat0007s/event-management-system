package com.example.eventmanagement.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.QuestionAnswerDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.AnswerRequest;
import com.example.eventmanagement.dto.QuestionRequest;
import com.example.eventmanagement.dto.QuestionResponse;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.QuestionAnswer;
import com.example.eventmanagement.model.User;

@Service
public class QuestionAnswerService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private EventDao eventDao;

    @Autowired
    private QuestionAnswerDao qaDao;

    /* ASK QUESTION */
    @Transactional
    public ResponseStructure<QuestionResponse> askQuestion(QuestionRequest request) {

        // Try both new and old method names for compatibility
        Integer userId = request.getUserId();
        if (userId == null) {
            userId = request.getAskedBy(); // Fallback to old method
        }
        
        User user = userDao.findUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventDao.findEventById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        QuestionAnswer qa = QuestionAnswer.builder()
                .question(request.getQuestion())
                .askedAt(LocalDateTime.now())
                .event(event)
                .askedBy(user)
                .build();

        QuestionAnswer saved = qaDao.save(qa);

        return ResponseStructure.<QuestionResponse>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Question submitted")
                .data(convertToResponse(saved))
                .build();
    }

    /* ANSWER QUESTION – ONLY CREATOR */
    @Transactional
    public ResponseStructure<QuestionResponse> answerQuestion(AnswerRequest request) {

        QuestionAnswer qa = qaDao.findByQaId(request.getQaId());

        Event event = qa.getEvent();
        
        // Try both new and old method names for compatibility
        Integer creatorId = request.getCreatorId();
        if (creatorId == null) {
            creatorId = request.getAnsweredBy(); // Fallback to old method
        }
        
        User answeredBy = userDao.findUserById(creatorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (event.getCreator().getUserId() != creatorId)
            throw new RuntimeException("Only event creator can answer");

        qa.setAnswer(request.getAnswer());
        qa.setAnsweredAt(LocalDateTime.now());
        qa.setAnsweredBy(answeredBy);

        QuestionAnswer saved = qaDao.save(qa);

        return ResponseStructure.<QuestionResponse>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Answer added")
                .data(convertToResponse(saved))
                .build();
    }

    /* VIEW Q&A FOR EVENT */
    public ResponseStructure<List<QuestionResponse>> viewQuestions(int eventId) {

        List<QuestionAnswer> questions = qaDao.findByEventId(eventId);
        List<QuestionResponse> responses = questions.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());

        return ResponseStructure.<List<QuestionResponse>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event questions")
                .data(responses)
                .build();
    }

    private QuestionResponse convertToResponse(QuestionAnswer qa) {
        return QuestionResponse.builder()
                .qaId(qa.getQaId())
                .question(qa.getQuestion())
                .answer(qa.getAnswer())
                .askedAt(qa.getAskedAt())
                .answeredAt(qa.getAnsweredAt())
                .eventId(qa.getEvent().getEventId())
                .eventName(qa.getEvent().getEventName())
                .askedBy(qa.getAskedBy().getUserId())
                .askedByName(qa.getAskedBy().getName())
                .answeredBy(qa.getAnsweredBy() != null ? qa.getAnsweredBy().getUserId() : null)
                .answeredByName(qa.getAnsweredBy() != null ? qa.getAnsweredBy().getName() : null)
                .build();
    }
}
