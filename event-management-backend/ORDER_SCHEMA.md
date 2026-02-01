# Order Management Backend Schema

## Overview
This document outlines the required backend schema and endpoints for order management in the Event Management System.

## Database Schema

### Orders Table
```sql
CREATE TABLE orders (
    order_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    payment_id VARCHAR(50),
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'refunded') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    venue VARCHAR(255),
    event_date DATE,
    event_time TIME,
    ticket_price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
```

### Attendees Table
```sql
CREATE TABLE attendees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(50) NOT NULL,
    event_id VARCHAR(50) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
```

## API Endpoints

### 1. Create Order
```
POST /api/orders/create
```

**Request Body:**
```json
{
    "userId": "user123",
    "paymentId": "pay_test_1643723400000",
    "items": [
        {
            "eventId": "event1",
            "eventName": "Tech Conference 2024",
            "venue": "Convention Center",
            "eventDate": "2024-03-15",
            "eventTime": "09:00",
            "ticketPrice": 500,
            "quantity": 2
        }
    ],
    "attendees": [
        {
            "firstName": "John",
            "lastName": "Doe",
            "email": "john@example.com",
            "eventId": "event1",
            "eventName": "Tech Conference 2024"
        }
    ],
    "totalAmount": 1000,
    "status": "confirmed"
}
```

**Response:**
```json
{
    "success": true,
    "orderId": "order_1643723400000",
    "message": "Order created successfully"
}
```

### 2. Get User Orders
```
GET /api/orders/user/{userId}
```

**Response:**
```json
{
    "success": true,
    "orders": [
        {
            "orderId": "order_1643723400000",
            "userId": "user123",
            "paymentId": "pay_test_1643723400000",
            "items": [...],
            "attendees": [...],
            "totalAmount": 1000,
            "status": "confirmed",
            "createdAt": "2024-02-01T10:30:00Z"
        }
    ]
}
```

### 3. Get Order by ID
```
GET /api/orders/{orderId}
```

**Response:**
```json
{
    "success": true,
    "order": {
        "orderId": "order_1643723400000",
        "userId": "user123",
        "paymentId": "pay_test_1643723400000",
        "items": [...],
        "attendees": [...],
        "totalAmount": 1000,
        "status": "confirmed",
        "createdAt": "2024-02-01T10:30:00Z"
    }
}
```

### 4. Update Order Status
```
PUT /api/orders/{orderId}/status
```

**Request Body:**
```json
{
    "status": "cancelled"
}
```

### 5. Enhanced Booking Endpoint
```
POST /api/tickets/book
```

**Request Body:**
```json
{
    "eventId": "event1",
    "userId": "user123",
    "attendeeNames": "John Doe, Jane Doe",
    "attendeeEmails": "john@example.com, jane@example.com",
    "quantity": 2,
    "amount": 1000
}
```

**Response:**
```json
{
    "success": true,
    "message": "Tickets booked successfully",
    "bookingId": "booking_1643723400000"
}
```

## Java Backend Implementation

### Order Entity
```java
@Entity
@Table(name = "orders")
public class Order {
    @Id
    private String orderId;
    
    @Column(name = "user_id")
    private String userId;
    
    @Column(name = "payment_id")
    private String paymentId;
    
    @Column(name = "total_amount")
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Attendee> attendees;
}

public enum OrderStatus {
    PENDING, CONFIRMED, CANCELLED, REFUNDED
}
```

### Order Controller
```java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            Order order = orderService.createOrder(orderRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orderId", order.getOrderId());
            response.put("message", "Order created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserOrders(@PathVariable String userId) {
        try {
            List<Order> orders = orderService.getOrdersByUserId(userId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("orders", orders);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch orders: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<Map<String, Object>> getOrderById(@PathVariable String orderId) {
        try {
            Order order = orderService.getOrderById(orderId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("order", order);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Order not found: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }
}
```

### Order Service
```java
@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private OrderItemRepository orderItemRepository;
    
    @Autowired
    private AttendeeRepository attendeeRepository;
    
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setOrderId("order_" + System.currentTimeMillis());
        order.setUserId(request.getUserId());
        order.setPaymentId(request.getPaymentId());
        order.setTotalAmount(request.getTotalAmount());
        order.setStatus(OrderStatus.CONFIRMED);
        
        order = orderRepository.save(order);
        
        // Save order items
        for (OrderItemRequest itemRequest : request.getItems()) {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setEventId(itemRequest.getEventId());
            item.setEventName(itemRequest.getEventName());
            item.setVenue(itemRequest.getVenue());
            item.setEventDate(LocalDate.parse(itemRequest.getEventDate()));
            item.setEventTime(LocalTime.parse(itemRequest.getEventTime()));
            item.setTicketPrice(itemRequest.getTicketPrice());
            item.setQuantity(itemRequest.getQuantity());
            orderItemRepository.save(item);
        }
        
        // Save attendees
        for (AttendeeRequest attendeeRequest : request.getAttendees()) {
            Attendee attendee = new Attendee();
            attendee.setOrder(order);
            attendee.setEventId(attendeeRequest.getEventId());
            attendee.setFirstName(attendeeRequest.getFirstName());
            attendee.setLastName(attendeeRequest.getLastName());
            attendee.setEmail(attendeeRequest.getEmail());
            attendeeRepository.save(attendee);
        }
        
        return order;
    }
    
    public List<Order> getOrdersByUserId(String userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}
```

## Integration Notes

1. **Payment Integration**: The order should be created after successful payment confirmation
2. **Inventory Management**: Update event capacity when order is confirmed
3. **Email Notifications**: Send confirmation emails with ticket details
4. **Ticket Generation**: Generate PDF tickets for confirmed orders
5. **Refund Handling**: Implement refund logic for cancelled orders

## Testing

Use the provided mock data in the frontend API for development and testing purposes. The frontend includes fallback data that works when running on localhost.
