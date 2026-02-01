package com.example.eventmanagement.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.QuestionAnswer;
import com.example.eventmanagement.repository.QuestionAnswerRepository;

@Repository
public class QuestionAnswerDao {

    @Autowired
    private QuestionAnswerRepository repository;

    public QuestionAnswer save(QuestionAnswer qa) {
        return repository.save(qa);
    }

    public QuestionAnswer saveQuestionAnswer(QuestionAnswer qa) {
        return repository.save(qa);
    }

    public QuestionAnswer findByQaId(int qaId) {
        return repository.findByQaId(qaId);
    }

    public List<QuestionAnswer> findByEventId(int eventId) {
        return repository.findByEventId(eventId);
    }
}
