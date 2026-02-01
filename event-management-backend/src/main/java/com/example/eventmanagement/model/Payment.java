package com.example.eventmanagement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private double amount;

    @ManyToOne
    private User user;

    @ManyToOne
    private Event event;

    private String status; // CREATED, SUCCESS, FAILED
}
