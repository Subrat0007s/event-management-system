package com.example.eventmanagement.dto;

import lombok.Data;

@Data
public class PaymentOrderRequest {
    private int userId;
    private int eventId;
    private double amount;
}
