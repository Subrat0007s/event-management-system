package com.example.eventmanagement.controller;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.OrderResponse;

import lombok.extern.slf4j.Slf4j;

/**
 * Demo Order Controller - Provides fallback order functionality
 * when database is not available
 */
@RestController
@RequestMapping("/api/demo/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://10.156.158.71:5173"})
@Slf4j
public class DemoOrderController {

    // In-memory storage for demo orders
    private static final Map<String, OrderResponse> demoOrders = new HashMap<>();
    
    static {
        // Initialize with some demo orders
        initDemoOrders();
    }
    
    private static void initDemoOrders() {
        // Demo Order 1
        OrderResponse order1 = OrderResponse.builder()
            .orderId("demo_order_" + System.currentTimeMillis() + "_1")
            .userId("1")
            .paymentId("pay_card_" + System.currentTimeMillis())
            .paymentMethod("card")
            .items(Arrays.asList(
                Map.of(
                    "eventId", "demo_event_1",
                    "eventName", "Tech Conference 2024",
                    "venue", "Convention Center",
                    "eventDate", "2024-03-15",
                    "eventTime", "09:00",
                    "ticketPrice", 500.0,
                    "quantity", 2
                )
            ))
            .attendees(Arrays.asList(
                Map.of(
                    "eventId", "demo_event_1",
                    "eventName", "Tech Conference 2024",
                    "firstName", "John",
                    "lastName", "Doe",
                    "email", "john@example.com"
                ),
                Map.of(
                    "eventId", "demo_event_1",
                    "eventName", "Tech Conference 2024",
                    "firstName", "Jane",
                    "lastName", "Doe",
                    "email", "jane@example.com"
                )
            ))
            .totalAmount(1000.0)
            .status("CONFIRMED")
            .createdAt(LocalDateTime.now().minusDays(1))
            .build();
        
        // Demo Order 2
        OrderResponse order2 = OrderResponse.builder()
            .orderId("demo_order_" + System.currentTimeMillis() + "_2")
            .userId("1")
            .paymentId("pay_upi_" + System.currentTimeMillis())
            .paymentMethod("upi")
            .items(Arrays.asList(
                Map.of(
                    "eventId", "demo_event_2",
                    "eventName", "Music Festival 2024",
                    "venue", "Central Park",
                    "eventDate", "2024-04-20",
                    "eventTime", "18:00",
                    "ticketPrice", 300.0,
                    "quantity", 1
                )
            ))
            .attendees(Arrays.asList(
                Map.of(
                    "eventId", "demo_event_2",
                    "eventName", "Music Festival 2024",
                    "firstName", "John",
                    "lastName", "Doe",
                    "email", "john@example.com"
                )
            ))
            .totalAmount(300.0)
            .status("CONFIRMED")
            .createdAt(LocalDateTime.now().minusDays(2))
            .build();
        
        demoOrders.put(order1.getOrderId(), order1);
        demoOrders.put(order2.getOrderId(), order2);
        
        log.info("Initialized {} demo orders", demoOrders.size());
    }
    
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createDemoOrder(@RequestBody Map<String, Object> request) {
        try {
            log.info("Creating demo order: {}", request);
            
            String orderId = "demo_order_" + System.currentTimeMillis();
            OrderResponse order = OrderResponse.builder()
                .orderId(orderId)
                .userId(String.valueOf(request.get("userId")))
                .paymentId(String.valueOf(request.get("paymentId")))
                .paymentMethod(String.valueOf(request.get("paymentMethod")))
                .totalAmount(Double.valueOf(request.get("totalAmount").toString()))
                .status("CONFIRMED")
                .createdAt(LocalDateTime.now())
                .items(Arrays.asList()) // Will be populated based on request
                .attendees(Arrays.asList()) // Will be populated based on request
                .build();
            
            demoOrders.put(orderId, order);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", orderId);
            response.put("message", "Demo order created successfully");
            response.put("order", order);
            
            log.info("Demo order created: {}", orderId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error creating demo order", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create demo order: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getDemoUserOrders(@PathVariable String userId) {
        try {
            log.info("Fetching demo orders for user: {}", userId);
            
            List<OrderResponse> userOrders = demoOrders.values().stream()
                .filter(order -> userId.equals(order.getUserId()))
                .sorted((o1, o2) -> o2.getCreatedAt().compareTo(o1.getCreatedAt()))
                .toList();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", userOrders);
            
            log.info("Found {} demo orders for user: {}", userOrders.size(), userId);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching demo orders for user: {}", userId, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch demo orders: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getDemoOrderById(@PathVariable String orderId) {
        try {
            log.info("Fetching demo order: {}", orderId);
            
            OrderResponse order = demoOrders.get(orderId);
            if (order == null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Demo order not found");
                return ResponseEntity.status(404).body(response);
            }
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Error fetching demo order: {}", orderId, e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch demo order: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
