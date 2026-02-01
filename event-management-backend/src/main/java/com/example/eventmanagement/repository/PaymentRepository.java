package com.example.eventmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.eventmanagement.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
