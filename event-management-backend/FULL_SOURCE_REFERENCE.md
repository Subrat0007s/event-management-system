# Backend Full Source Reference

All Java files with full imports. Use this if you need to recreate or verify any file.

---

## config/WebConfig.java

```java
package com.example.eventmanagement.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

---

## controller/UserController.java

```java
package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.dto.UserRequest;
import com.example.eventmanagement.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseStructure<String> register(@RequestBody UserRequest request) {
        return userService.registerUser(request);
    }

    @GetMapping("/verify")
    public ResponseStructure<String> verifyEmail(@RequestParam String token) {
        return userService.verifyUser(token);
    }

    @PostMapping("/login")
    public ResponseStructure<Integer> login(@RequestBody LoginRequest request) {
        return userService.login(request.getEmail(), request.getPassword());
    }

    @PostMapping("/verify-otp")
    public ResponseStructure<String> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {
        return userService.verifyOtp(email, otp);
    }

    @PostMapping("/resend-otp")
    public ResponseStructure<String> resendOtp(@RequestParam String email) {
        return userService.resendOtp(email);
    }

    @PutMapping("/update-profile")
    public ResponseStructure<String> updateProfile(
            @RequestParam String email,
            @RequestParam String name) {
        return userService.updateProfile(email, name);
    }

    @PutMapping("/change-password")
    public ResponseStructure<String> changePassword(
            @RequestParam String email,
            @RequestParam String oldPwd,
            @RequestParam String newPwd) {
        return userService.changePassword(email, oldPwd, newPwd);
    }
}
```

---

## controller/EventController.java

```java
package com.example.eventmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.EventRequest;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.service.EventService;

@CrossOrigin
@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @PostMapping("/create")
    public ResponseStructure<Event> createEvent(@RequestBody EventRequest request, @RequestParam int userId) {
        return eventService.createEvent(request, userId);
    }

    @GetMapping("/all")
    public ResponseStructure<List<Event>> viewAllEvents() {
        return eventService.viewAllEvents();
    }

    @DeleteMapping("/delete")
    public ResponseStructure<String> deleteEvent(@RequestParam int eventId, @RequestParam int userId) {
        return eventService.deleteEvent(eventId, userId);
    }

    @GetMapping("/bookings")
    public ResponseStructure<List<?>> viewBookings(@RequestParam int eventId, @RequestParam int creatorId) {
        return eventService.viewEventBookings(eventId, creatorId);
    }

    @PutMapping("/update")
    public ResponseStructure<Event> updateEvent(@RequestParam int eventId, @RequestParam int creatorId,
            @RequestBody EventRequest request) {
        return eventService.updateEvent(eventId, creatorId, request);
    }
}
```

---

## controller/TicketController.java

```java
package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Ticket;
import com.example.eventmanagement.service.TicketService;

@CrossOrigin
@RestController
@RequestMapping("/tickets")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @PostMapping("/book")
    public ResponseStructure<Ticket> bookTicket(@RequestParam int userId, @RequestParam int eventId) {
        return ticketService.bookEvent(userId, eventId);
    }
}
```

---

## controller/PaymentController.java

```java
package com.example.eventmanagement.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;
import com.example.eventmanagement.dto.*;
import com.example.eventmanagement.service.PaymentService;
import com.razorpay.Order;

@RestController
@RequestMapping("/payment")
@CrossOrigin
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/create-order")
    public Map<String, Object> createOrder(@RequestBody PaymentOrderRequest req) throws Exception {
        Order order = service.createOrder(req.getAmount());
        return Map.of("orderId", String.valueOf(order.get("id")), "amount", order.get("amount"));
    }

    @PostMapping("/verify")
    public boolean verify(@RequestBody PaymentVerifyRequest req) throws Exception {
        return service.verifySignature(
            req.getRazorpayOrderId(),
            req.getRazorpayPaymentId(),
            req.getRazorpaySignature()
        );
    }
}
```

---

## controller/QuestionAnswerController.java

```java
package com.example.eventmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.QuestionAnswer;
import com.example.eventmanagement.service.QuestionAnswerService;

@CrossOrigin
@RestController
@RequestMapping("/qa")
public class QuestionAnswerController {

    @Autowired
    private QuestionAnswerService qaService;

    @PostMapping("/ask")
    public ResponseStructure<QuestionAnswer> ask(
            @RequestParam int userId,
            @RequestParam int eventId,
            @RequestParam String question) {
        return qaService.askQuestion(userId, eventId, question);
    }

    @PostMapping("/answer")
    public ResponseStructure<QuestionAnswer> answer(
            @RequestParam int qaId,
            @RequestParam int creatorId,
            @RequestParam String answer) {
        return qaService.answerQuestion(qaId, creatorId, answer);
    }

    @GetMapping("/view")
    public ResponseStructure<List<QuestionAnswer>> view(
            @RequestParam int eventId) {
        return qaService.viewQuestions(eventId);
    }
}
```

---

## exception/GlobalExceptionHandler.java

```java
package com.example.eventmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.ResponseStructure;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ResponseStructure<String>> handleRuntime(RuntimeException ex) {
        ResponseStructure<String> response = ResponseStructure.<String>builder()
                .statusCode(HttpStatus.BAD_REQUEST.value()).message(ex.getMessage()).data("ERROR").build();
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseStructure<String>> handleException(Exception ex) {
        ResponseStructure<String> response = ResponseStructure.<String>builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()).message("Internal server error").data("ERROR")
                .build();
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
```

---

## repository/EventRepository.java (fixed search query)

```java
package com.example.eventmanagement.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.Event;

public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query("select e from Event e where e.creator.userId = ?1")
    List<Event> findEventsByCreator(int userId);

    @Query("select e from Event e where e.eventDate >= ?1")
    List<Event> findUpcomingEvents(LocalDate date);

    @Query("select e from Event e where lower(e.eventName) like lower(concat('%', ?1, '%'))")
    List<Event> searchByEventName(String keyword);

    @Query("select e from Event e where e.eventId = ?1 and e.creator.userId = ?2")
    Optional<Event> findEventByIdAndCreator(int eventId, int userId);
}
```

---

All other files (models, DTOs, DAOs, repositories, services, util) remain as in your project. No Spring Security is used; auth is email verification link + OTP only.
