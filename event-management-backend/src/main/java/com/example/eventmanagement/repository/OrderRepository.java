package com.example.eventmanagement.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    Optional<Order> findByOrderUuid(String orderUuid);
    
    List<Order> findByUserUserIdOrderByCreatedAtDesc(int userId);
    
    @Query("SELECT o FROM Order o WHERE o.user.userId = :userId ORDER BY o.createdAt DESC")
    List<Order> findOrdersByUserId(@Param("userId") int userId);
}
