package com.example.eventmanagement.service;

import org.springframework.stereotype.Service;
import org.json.JSONObject;

@Service
public class PaymentService {

    public String createOrder(double amount) {
        // Create a simple mock order response
        JSONObject mockOrder = new JSONObject();
        String orderId = "order_mock_" + System.currentTimeMillis();
        
        mockOrder.put("id", orderId);
        mockOrder.put("amount", (int) amount);
        mockOrder.put("currency", "INR");
        mockOrder.put("status", "created");
        mockOrder.put("receipt", "receipt_" + System.currentTimeMillis());
        
        return orderId;
    }

    public boolean verifySignature(
            String orderId,
            String paymentId,
            String signature
    ) {
        // For testing purposes, always return true for mock orders
        return orderId != null && orderId.startsWith("order_mock_");
    }
}
