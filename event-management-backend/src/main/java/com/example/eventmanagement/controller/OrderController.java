package com.example.eventmanagement.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.OrderRequest;
import com.example.eventmanagement.dto.OrderResponse;
import com.example.eventmanagement.service.OrderService;

import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
@Slf4j
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest request) {
        try {
            log.info("Received order creation request: {}", request);
            
            // Basic validation
            if (request.getUserId() == null || request.getUserId().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User ID is required"));
            }
            
            if (request.getPaymentMethod() == null || request.getPaymentMethod().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Payment method is required"));
            }
            
            if (request.getTotalAmount() == null || request.getTotalAmount() <= 0) {
                return ResponseEntity.badRequest().body(createErrorResponse("Total amount must be greater than 0"));
            }
            
            OrderResponse order = orderService.createOrder(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", order.getOrderId());
            response.put("message", "Order created successfully");
            response.put("order", order);
            
            log.info("Order created successfully: {}", order.getOrderId());
            return ResponseEntity.ok(response);
            
        } catch (NumberFormatException e) {
            log.error("Invalid number format in order request", e);
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid number format"));
        } catch (RuntimeException e) {
            log.error("Runtime error creating order", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error creating order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to create order: " + e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserOrders(@PathVariable String userId) {
        try {
            log.info("Fetching orders for user: {}", userId);
            
            if (userId == null || userId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("User ID is required"));
            }
            
            List<OrderResponse> orders = orderService.getOrdersByUserId(userId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", orders);
            
            log.info("Successfully fetched {} orders for user: {}", orders.size(), userId);
            return ResponseEntity.ok(response);
            
        } catch (NumberFormatException e) {
            log.error("Invalid user ID format: {}", userId, e);
            return ResponseEntity.badRequest().body(createErrorResponse("Invalid user ID format"));
        } catch (RuntimeException e) {
            log.error("Runtime error fetching user orders", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error fetching user orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to fetch orders: " + e.getMessage()));
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable String orderId) {
        try {
            log.info("Fetching order by UUID: {}", orderId);
            
            if (orderId == null || orderId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Order ID is required"));
            }
            
            OrderResponse order = orderService.getOrderByUuid(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);
            
            log.info("Successfully fetched order: {}", orderId);
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            log.error("Order not found: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(createErrorResponse(e.getMessage()));
        } catch (Exception e) {
            log.error("Unexpected error fetching order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(createErrorResponse("Failed to fetch order: " + e.getMessage()));
        }
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        return response;
    }
}
