package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventmanagement.model.ForumComment;

public interface ForumCommentRepository extends JpaRepository<ForumComment, Integer> {
    
    List<ForumComment> findByPost_PostId(int postId);
    
    List<ForumComment> findByAuthor_UserId(int userId);
    
    @Query("SELECT fc FROM ForumComment fc WHERE fc.post.postId = :postId ORDER BY fc.createdAt ASC")
    List<ForumComment> findByPostIdOrderByCreatedAtAsc(@Param("postId") int postId);
}
