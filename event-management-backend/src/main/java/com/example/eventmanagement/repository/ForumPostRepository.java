package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventmanagement.model.ForumPost;

public interface ForumPostRepository extends JpaRepository<ForumPost, Integer> {
    
    List<ForumPost> findByEvent_EventId(int eventId);
    
    List<ForumPost> findByAuthor_UserId(int userId);
    
    @Query("SELECT fp FROM ForumPost fp WHERE fp.event.eventId = :eventId ORDER BY fp.createdAt DESC")
    List<ForumPost> findByEventIdOrderByCreatedAtDesc(@Param("eventId") int eventId);
    
    @Query("SELECT fp FROM ForumPost fp WHERE fp.title LIKE %:keyword% OR fp.content LIKE %:keyword%")
    List<ForumPost> searchByKeyword(@Param("keyword") String keyword);
}
