package com.example.eventmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventmanagement.model.Poll;

public interface PollRepository extends JpaRepository<Poll, Integer> {
    
    List<Poll> findByEvent_EventId(int eventId);
    
    List<Poll> findByCreatedBy_UserId(int userId);
    
    Optional<Poll> findByPollIdAndEvent_EventId(int pollId, int eventId);
    
    @Query("SELECT p FROM Poll p WHERE p.event.eventId = :eventId AND p.endsAt > CURRENT_TIMESTAMP")
    List<Poll> findActivePollsByEvent(@Param("eventId") int eventId);
    
    @Query("SELECT p FROM Poll p WHERE p.endsAt <= CURRENT_TIMESTAMP")
    List<Poll> findExpiredPolls();
}
