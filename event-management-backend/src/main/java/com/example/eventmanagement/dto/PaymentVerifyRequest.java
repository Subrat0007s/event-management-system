package com.example.eventmanagement.dto;

import lombok.Data;

@Data
public class PaymentVerifyRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private int userId;
    private int eventId;
}
