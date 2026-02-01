package com.example.eventmanagement.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    
    private String orderId;
    private String userId;
    private String paymentId;
    private String paymentMethod;
    private List<Object> items;
    private List<Object> attendees;
    private Double totalAmount;
    private String status;
    private LocalDateTime createdAt;
}
