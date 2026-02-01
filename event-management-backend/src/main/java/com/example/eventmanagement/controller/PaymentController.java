package com.example.eventmanagement.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.eventmanagement.dto.*;
import com.example.eventmanagement.service.PaymentService;

@RestController
@RequestMapping("/payment")
@CrossOrigin
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody PaymentOrderRequest req) {
        try {
            String orderId = service.createOrder(req.getAmount());
            Map<String, Object> response = Map.of(
                "success", true,
                "orderId", orderId,
                "amount", (int) req.getAmount(),
                "currency", "INR",
                "status", "created"
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "error", "Failed to create payment order: " + e.getMessage(),
                "message", "Payment service unavailable. Please try again."
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verify(@RequestBody PaymentVerifyRequest req) {
        try {
            boolean isValid = service.verifySignature(
                req.getRazorpayOrderId(),
                req.getRazorpayPaymentId(),
                req.getRazorpaySignature()
            );
            
            Map<String, Object> response = Map.of(
                "success", isValid,
                "message", isValid ? "Payment verified successfully" : "Payment verification failed"
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                "success", false,
                "error", "Payment verification failed: " + e.getMessage(),
                "message", "Unable to verify payment. Please contact support."
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
