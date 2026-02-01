package com.example.eventmanagement.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.example.eventmanagement.model.Payment;
import com.example.eventmanagement.repository.PaymentRepository;

@Repository
public class PaymentDao {

    @Autowired
    private PaymentRepository repo;

    public Payment save(Payment payment) {
        return repo.save(payment);
    }
}
