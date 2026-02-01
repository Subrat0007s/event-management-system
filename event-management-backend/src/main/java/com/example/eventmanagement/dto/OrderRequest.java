package com.example.eventmanagement.dto;

import java.util.List;
import java.util.Map;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    
    private String userId;
    private String paymentId;
    private String paymentMethod;
    private Map<String, Object> paymentDetails;
    private List<Object> items;
    private List<Object> attendees;
    private Double totalAmount;
    private String status;
}
