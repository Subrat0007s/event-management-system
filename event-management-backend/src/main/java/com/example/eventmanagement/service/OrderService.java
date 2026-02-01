package com.example.eventmanagement.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.eventmanagement.dto.OrderRequest;
import com.example.eventmanagement.dto.OrderResponse;
import com.example.eventmanagement.model.Order;
import com.example.eventmanagement.repository.OrderRepository;
import com.example.eventmanagement.repository.UserRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public OrderResponse createOrder(OrderRequest request) {
        try {
            log.info("Creating order for user: {}", request.getUserId());
            
            // Find user
            var user = userRepository.findById(Integer.parseInt(request.getUserId()))
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + request.getUserId()));
            
            // Create order
            Order order = Order.builder()
                .user(user)
                .paymentId(request.getPaymentId())
                .paymentMethod(request.getPaymentMethod())
                .totalAmount(request.getTotalAmount())
                .status(request.getStatus() != null ? request.getStatus() : "confirmed")
                .build();
            
            order = orderRepository.save(order);
            log.info("Order created with ID: {}", order.getOrderUuid());
            
            // Convert to response
            return convertToResponse(order);
            
        } catch (Exception e) {
            log.error("Error creating order", e);
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }
    
    public List<OrderResponse> getOrdersByUserId(String userId) {
        try {
            log.info("Fetching orders for user: {}", userId);
            
            List<Order> orders = orderRepository.findByUserUserIdOrderByCreatedAtDesc(Integer.parseInt(userId));
            log.info("Found {} orders for user: {}", orders.size(), userId);
            
            return orders.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
                
        } catch (NumberFormatException e) {
            log.error("Invalid user ID format: {}", userId);
            throw new RuntimeException("Invalid user ID format: " + userId);
        } catch (Exception e) {
            log.error("Error fetching orders for user: {}", userId, e);
            throw new RuntimeException("Failed to fetch orders: " + e.getMessage());
        }
    }
    
    public OrderResponse getOrderByUuid(String orderUuid) {
        try {
            Order order = orderRepository.findByOrderUuid(orderUuid)
                .orElseThrow(() -> new RuntimeException("Order not found with UUID: " + orderUuid));
            return convertToResponse(order);
        } catch (Exception e) {
            log.error("Error fetching order by UUID: {}", orderUuid, e);
            throw new RuntimeException("Order not found: " + e.getMessage());
        }
    }
    
   
    private OrderResponse convertToResponse(Order order) {
        try {
            return OrderResponse.builder()
                .orderId(order.getOrderUuid())
                .userId(order.getUser() != null ? String.valueOf(order.getUser().getUserId()) : "unknown")
                .paymentId(order.getPaymentId())
                .paymentMethod(order.getPaymentMethod())
                .items(List.of()) // Simplified for now
                .attendees(List.of()) // Simplified for now
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
                
        } catch (Exception e) {
            log.error("Error converting order to response: {}", order.getOrderUuid(), e);
            // Return a basic response even if conversion fails
            return OrderResponse.builder()
                .orderId(order.getOrderUuid())
                .userId("unknown")
                .paymentId(order.getPaymentId())
                .paymentMethod(order.getPaymentMethod())
                .items(List.of())
                .attendees(List.of())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
        }
    }
}
