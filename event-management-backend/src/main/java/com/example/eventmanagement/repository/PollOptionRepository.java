package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventmanagement.model.PollOption;

public interface PollOptionRepository extends JpaRepository<PollOption, Integer> {

    @Query("select po from PollOption po where po.poll.pollId = :pollId")
    List<PollOption> findByPoll_PollId(@Param("pollId") int pollId);

    @Query("select po from PollOption po where po.poll.pollId = :pollId")
    List<PollOption> findOptionsByPollId(@Param("pollId") int pollId);
}
