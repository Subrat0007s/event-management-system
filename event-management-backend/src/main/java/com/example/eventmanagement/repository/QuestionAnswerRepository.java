package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.QuestionAnswer;

public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Integer> {

    @Query("select q from QuestionAnswer q where q.event.eventId = ?1")
    List<QuestionAnswer> findByEventId(int eventId);

    @Query("select q from QuestionAnswer q where q.qaId = ?1")
    QuestionAnswer findByQaId(int qaId);
}
