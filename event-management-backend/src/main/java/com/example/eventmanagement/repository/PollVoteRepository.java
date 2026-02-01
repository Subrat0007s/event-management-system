package com.example.eventmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventmanagement.model.PollVote;

public interface PollVoteRepository extends JpaRepository<PollVote, Integer> {
    
    List<PollVote> findByPoll_PollId(int pollId);
    
    List<PollVote> findByOption_OptionId(int optionId);
    
    List<PollVote> findByUser_UserId(int userId);
    
    Optional<PollVote> findByPoll_PollIdAndUser_UserId(int pollId, int userId);
    
    @Query("SELECT COUNT(pv) FROM PollVote pv WHERE pv.option.optionId = :optionId")
    Long countVotesByOption(@Param("optionId") int optionId);
    
    @Query("SELECT COUNT(pv) FROM PollVote pv WHERE pv.poll.pollId = :pollId")
    Long countTotalVotesByPoll(@Param("pollId") int pollId);
}
