# Event Management Backend – Full Code (Copy-Paste)

Save each code block to the file path shown above it. All imports are included.

---

## 1. EventManagementBackendApplication.java  
**Path:** `src/main/java/com/example/eventmanagement/EventManagementBackendApplication.java`

```java
package com.example.eventmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EventManagementBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EventManagementBackendApplication.class, args);
	}
}
```

---

## 2. WebConfig.java  
**Path:** `src/main/java/com/example/eventmanagement/config/WebConfig.java`

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

## 3. UserController.java  
**Path:** `src/main/java/com/example/eventmanagement/controller/UserController.java`

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

## 4. EventController.java  
**Path:** `src/main/java/com/example/eventmanagement/controller/EventController.java`

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

## 5. TicketController.java  
**Path:** `src/main/java/com/example/eventmanagement/controller/TicketController.java`

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

## 6. PaymentController.java  
**Path:** `src/main/java/com/example/eventmanagement/controller/PaymentController.java`

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

## 7. QuestionAnswerController.java  
**Path:** `src/main/java/com/example/eventmanagement/controller/QuestionAnswerController.java`

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

## 8. GlobalExceptionHandler.java  
**Path:** `src/main/java/com/example/eventmanagement/exception/GlobalExceptionHandler.java`

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

## 9. User.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/User.java`

```java
package com.example.eventmanagement.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.example.eventmanagement.util.LoginStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private int userId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    @JsonIgnore
    private String password;

    @Column(name = "verified", nullable = false)
    private boolean verified;

    @Enumerated(EnumType.STRING)
    @Column(name = "login_status")
    private LoginStatus loginStatus;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "creator", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Event> events;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking> bookings;
}
```

---

## 10. Event.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/Event.java`

```java
package com.example.eventmanagement.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.example.eventmanagement.util.EventStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "event_id")
    private int eventId;

    @Column(name = "event_name", nullable = false)
    private String eventName;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "venue", nullable = false)
    private String venue;

    @Column(name = "event_date", nullable = false)
    private LocalDate eventDate;

    @Column(name = "event_time", nullable = false)
    private LocalTime eventTime;

    @Column(name = "ticket_price", nullable = false)
    private double ticketPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_status")
    private EventStatus eventStatus;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Booking> bookings;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<QuestionAnswer> questions;
}
```

---

## 11. Booking.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/Booking.java`

```java
package com.example.eventmanagement.model;

import java.time.LocalDateTime;

import com.example.eventmanagement.util.PaymentStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "booking_id")
    private int bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Column(name = "booking_time")
    private LocalDateTime bookingTime;
}
```

---

## 12. Ticket.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/Ticket.java`

```java
package com.example.eventmanagement.model;

import com.example.eventmanagement.util.TicketStatus;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tickets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_id")
    private int ticketId;

    @OneToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    @Column(name = "ticket_status")
    private TicketStatus ticketStatus;
}
```

---

## 13. QuestionAnswer.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/QuestionAnswer.java`

```java
package com.example.eventmanagement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions_answers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionAnswer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int qaId;

	@Column(name = "question", nullable = false)
	private String question;

	@Column(name = "answer")
	private String answer;

	@ManyToOne
	@JoinColumn(name = "event_id")
	private Event event;

	@ManyToOne
	@JoinColumn(name = "asked_by")
	private User askedBy;
}
```

---

## 14. OtpVerification.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/OtpVerification.java`

```java
package com.example.eventmanagement.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "otp_verification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int otpId;

    @Column(nullable = false)
    private String otp;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
```

---

## 15. EmailVerificationToken.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/EmailVerificationToken.java`

```java
package com.example.eventmanagement.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "email_verification_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailVerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int tokenId;

    @Column(nullable = false, unique = true)
    private String token;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
```

---

## 16. Payment.java (model)  
**Path:** `src/main/java/com/example/eventmanagement/model/Payment.java`

```java
package com.example.eventmanagement.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;

    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;

    private double amount;

    @ManyToOne
    private User user;

    @ManyToOne
    private Event event;

    private String status;
}
```

---

## 17. ResponseStructure.java (dto)  
**Path:** `src/main/java/com/example/eventmanagement/dto/ResponseStructure.java`

```java
package com.example.eventmanagement.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseStructure<T> {

	private int statusCode;
	private String message;
	private T data;
}
```

---

## 18. UserRequest.java (dto)  
**Path:** `src/main/java/com/example/eventmanagement/dto/UserRequest.java`

```java
package com.example.eventmanagement.dto;

import java.time.LocalDate;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

	private String name;
	private LocalDate dob;
	private String email;
	private String password;
}
```

---

## 19. LoginRequest.java (dto)  
**Path:** `src/main/java/com/example/eventmanagement/dto/LoginRequest.java`

```java
package com.example.eventmanagement.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

    private String email;
    private String password;
}
```

---

## 20. EventRequest.java (dto)  
**Path:** `src/main/java/com/example/eventmanagement/dto/EventRequest.java`

```java
package com.example.eventmanagement.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {

    private String eventName;
    private String description;
    private String venue;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private Double ticketPrice;
}
```

---

## 21. PaymentOrderRequest.java (dto)  
**Path:** `src/main/java/com/example/eventmanagement/dto/PaymentOrderRequest.java`

```java
package com.example.eventmanagement.dto;

import lombok.Data;

@Data
public class PaymentOrderRequest {
    private int userId;
    private int eventId;
    private double amount;
}
```

---

## 22. PaymentVerifyRequest.java (dto)  
**Path:** `src/main/java/com/example/eventmanagement/dto/PaymentVerifyRequest.java`

```java
package com.example.eventmanagement.dto;

import lombok.Data;

@Data
public class PaymentVerifyRequest {
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private String razorpaySignature;
    private int userId;
    private int eventId;
}
```

---

## 23. EmailConfiguration.java (dto)  
**Path:** `src/main/java/com/example/eventmanagement/dto/EmailConfiguration.java`

```java
package com.example.eventmanagement.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailConfiguration {

    private String to;
    private String subject;
    private String body;
}
```

---

## 24. LoginStatus.java (util)  
**Path:** `src/main/java/com/example/eventmanagement/util/LoginStatus.java`

```java
package com.example.eventmanagement.util;

public enum LoginStatus {
	LOGGED_IN, LOGGED_OUT, OTP_PENDING
}
```

---

## 25. EventStatus.java (util)  
**Path:** `src/main/java/com/example/eventmanagement/util/EventStatus.java`

```java
package com.example.eventmanagement.util;

public enum EventStatus {
	CREATED, UPDATED, CANCELLED, COMPLETED
}
```

---

## 26. PaymentStatus.java (util)  
**Path:** `src/main/java/com/example/eventmanagement/util/PaymentStatus.java`

```java
package com.example.eventmanagement.util;

public enum PaymentStatus {
	PENDING, SUCCESS, FAILED
}
```

---

## 27. TicketStatus.java (util)  
**Path:** `src/main/java/com/example/eventmanagement/util/TicketStatus.java`

```java
package com.example.eventmanagement.util;

public enum TicketStatus {
	ACTIVE, CANCELLED, USED
}
```

---

## 28. OtpGenerator.java (util)  
**Path:** `src/main/java/com/example/eventmanagement/util/OtpGenerator.java`

```java
package com.example.eventmanagement.util;

import java.util.Random;

public class OtpGenerator {

    public static String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
```

---

## 29. UserDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/UserDao.java`

```java
package com.example.eventmanagement.dao;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.util.LoginStatus;

@Repository
public class UserDao {

	@Autowired
	private UserRepository userRepository;

	public User saveUser(User user) {
		user.setCreatedAt(LocalDateTime.now());
		user.setLoginStatus(LoginStatus.LOGGED_OUT);
		return userRepository.save(user);
	}

	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public Optional<User> findVerifiedUserByEmail(String email) {
		return userRepository.findVerifiedUserByEmail(email);
	}

	public Optional<User> findVerifiedUserById(int userId) {
		return userRepository.findVerifiedUserById(userId);
	}

	public User updateUser(User user) {
		return userRepository.save(user);
	}
}
```

---

## 30. EventDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/EventDao.java`

```java
package com.example.eventmanagement.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.repository.EventRepository;

@Repository
public class EventDao {

    @Autowired
    private EventRepository eventRepository;

    public Event saveEvent(Event event) {
        return eventRepository.save(event);
    }

    public Optional<Event> findEventById(int eventId) {
        return eventRepository.findById(eventId);
    }

    public Optional<Event> findEventByIdAndCreator(int eventId, int userId) {
        return eventRepository.findEventByIdAndCreator(eventId, userId);
    }

    public List<Event> findEventsByCreator(int userId) {
        return eventRepository.findEventsByCreator(userId);
    }

    public List<Event> findUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDate.now());
    }

    public List<Event> searchEvents(String keyword) {
        return eventRepository.searchByEventName(keyword);
    }

    public void deleteEvent(Event event) {
        eventRepository.delete(event);
    }
}
```

---

## 31. BookingDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/BookingDao.java`

```java
package com.example.eventmanagement.dao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.Booking;
import com.example.eventmanagement.repository.BookingRepository;
import com.example.eventmanagement.util.PaymentStatus;

@Repository
public class BookingDao {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setBookingTime(LocalDateTime.now());
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        return bookingRepository.save(booking);
    }

    public List<Booking> findBookingsByUser(int userId) {
        return bookingRepository.findBookingsByUser(userId);
    }

    public List<Booking> findBookingsByEvent(int eventId) {
        return bookingRepository.findBookingsByEvent(eventId);
    }

    public long countBookingsForEvent(int eventId) {
        return bookingRepository.countBookingsForEvent(eventId);
    }
}
```

---

## 32. TicketDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/TicketDao.java`

```java
package com.example.eventmanagement.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.Ticket;
import com.example.eventmanagement.repository.TicketRepository;
import com.example.eventmanagement.util.TicketStatus;

@Repository
public class TicketDao {

    @Autowired
    private TicketRepository ticketRepository;

    public Ticket saveTicket(Ticket ticket) {
        ticket.setTicketStatus(TicketStatus.ACTIVE);
        return ticketRepository.save(ticket);
    }

    public Optional<Ticket> findByBookingId(int bookingId) {
        return ticketRepository.findByBookingId(bookingId);
    }
}
```

---

## 33. OtpVerificationDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/OtpVerificationDao.java`

```java
package com.example.eventmanagement.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.OtpVerification;
import com.example.eventmanagement.repository.OtpVerificationRepository;

@Repository
public class OtpVerificationDao {

	@Autowired
	private OtpVerificationRepository repository;

	public OtpVerification getLatestOtp(int userId) {
		List<OtpVerification> list = repository.findLatestOtp(userId);
		if (list.isEmpty()) {
			throw new RuntimeException("OTP not found");
		}
		return list.get(0);
	}

	public void deleteAll(int userId) {
		repository.deleteByUser_UserId(userId);
	}

	public void saveOtp(OtpVerification otp) {
		repository.save(otp);
	}
}
```

---

## 34. EmailVerificationTokenDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/EmailVerificationTokenDao.java`

```java
package com.example.eventmanagement.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.EmailVerificationToken;
import com.example.eventmanagement.repository.EmailVerificationTokenRepository;

@Repository
public class EmailVerificationTokenDao {

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    public EmailVerificationToken saveToken(EmailVerificationToken token) {
        return tokenRepository.save(token);
    }

    public Optional<EmailVerificationToken> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public void deleteToken(EmailVerificationToken token) {
        tokenRepository.delete(token);
    }
}
```

---

## 35. QuestionAnswerDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/QuestionAnswerDao.java`

```java
package com.example.eventmanagement.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.QuestionAnswer;
import com.example.eventmanagement.repository.QuestionAnswerRepository;

@Repository
public class QuestionAnswerDao {

    @Autowired
    private QuestionAnswerRepository repository;

    public QuestionAnswer save(QuestionAnswer qa) {
        return repository.save(qa);
    }

    public QuestionAnswer findByQaId(int qaId) {
        return repository.findByQaId(qaId);
    }

    public List<QuestionAnswer> findByEventId(int eventId) {
        return repository.findByEventId(eventId);
    }
}
```

---

## 36. PaymentDao.java  
**Path:** `src/main/java/com/example/eventmanagement/dao/PaymentDao.java`

```java
package com.example.eventmanagement.dao;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.Payment;
import com.example.eventmanagement.repository.PaymentRepository;

@Repository
public class PaymentDao {

    @Autowired
    private PaymentRepository repo;

    public Payment save(Payment payment) {
        return repo.save(payment);
    }
}
```

---

## 37. UserRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/UserRepository.java`

```java
package com.example.eventmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select u from User u where u.email = ?1")
    Optional<User> findByEmail(String email);

    @Query("select u from User u where u.email = ?1 and u.verified = true")
    Optional<User> findVerifiedUserByEmail(String email);

    @Query("select u from User u where u.userId = ?1 and u.verified = true")
    Optional<User> findVerifiedUserById(int userId);

    @Query("select count(u) from User u where u.verified = true")
    long countVerifiedUsers();
}
```

---

## 38. EventRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/EventRepository.java`

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

## 39. BookingRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/BookingRepository.java`

```java
package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("select b from Booking b where b.user.userId = ?1")
    List<Booking> findBookingsByUser(int userId);

    @Query("select b from Booking b where b.event.eventId = ?1")
    List<Booking> findBookingsByEvent(int eventId);

    @Query("select count(b) from Booking b where b.event.eventId = ?1")
    long countBookingsForEvent(int eventId);
}
```

---

## 40. TicketRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/TicketRepository.java`

```java
package com.example.eventmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    @Query("select t from Ticket t where t.booking.bookingId = ?1")
    Optional<Ticket> findByBookingId(int bookingId);

    @Query("select t from Ticket t where t.ticketStatus = 'ACTIVE'")
    Optional<Ticket> findActiveTickets();
}
```

---

## 41. OtpVerificationRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/OtpVerificationRepository.java`

```java
package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.OtpVerification;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Integer> {

	@Query("""
			SELECT o FROM OtpVerification o
			WHERE o.user.userId = ?1
			ORDER BY o.generatedAt DESC
			""")
	List<OtpVerification> findLatestOtp(int userId);

	void deleteByUser_UserId(int userId);
}
```

---

## 42. EmailVerificationTokenRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/EmailVerificationTokenRepository.java`

```java
package com.example.eventmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.EmailVerificationToken;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Integer> {

	@Query("select e from EmailVerificationToken e where e.token = ?1")
	Optional<EmailVerificationToken> findByToken(String token);
}
```

---

## 43. QuestionAnswerRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/QuestionAnswerRepository.java`

```java
package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.QuestionAnswer;

public interface QuestionAnswerRepository extends JpaRepository<QuestionAnswer, Integer> {

    @Query("select q from QuestionAnswer q where q.event.eventId = ?1")
    List<QuestionAnswer> findByEventId(int eventId);

    @Query("select q from QuestionAnswer q where q.qaId = ?1")
    QuestionAnswer findByQaId(int qaId);
}
```

---

## 44. PaymentRepository.java  
**Path:** `src/main/java/com/example/eventmanagement/repository/PaymentRepository.java`

```java
package com.example.eventmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.eventmanagement.model.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
}
```

---

## 45. UserService.java  
**Path:** `src/main/java/com/example/eventmanagement/service/UserService.java`

```java
package com.example.eventmanagement.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.EmailVerificationTokenDao;
import com.example.eventmanagement.dao.OtpVerificationDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.EmailConfiguration;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.dto.UserRequest;
import com.example.eventmanagement.model.EmailVerificationToken;
import com.example.eventmanagement.model.OtpVerification;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.util.LoginStatus;
import com.example.eventmanagement.util.OtpGenerator;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private EmailService emailService;

    @Autowired
    private LinkGeneratorService linkGeneratorService;

    @Autowired
    private EmailVerificationTokenDao tokenDao;

    @Autowired
    private OtpVerificationDao otpDao;

    public ResponseStructure<String> registerUser(UserRequest request) {
        User user = User.builder()
                .name(request.getName())
                .dob(request.getDob())
                .email(request.getEmail())
                .password(request.getPassword())
                .verified(false)
                .build();

        userDao.saveUser(user);

        String token = linkGeneratorService.generateVerificationLink();

        EmailVerificationToken verificationToken =
                EmailVerificationToken.builder()
                        .token(token)
                        .expiryTime(LocalDateTime.now().plusMinutes(15))
                        .user(user)
                        .build();

        tokenDao.saveToken(verificationToken);

        EmailConfiguration mail = EmailConfiguration.builder()
                .to(user.getEmail())
                .subject("Verify your account")
                .body("Click to verify: http://localhost:8080/user/verify?token=" + token)
                .build();

        emailService.sendMail(mail);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Verification link sent to email")
                .data("Check your inbox")
                .build();
    }

    public ResponseStructure<String> verifyUser(String token) {
        EmailVerificationToken verificationToken =
                tokenDao.findByToken(token)
                        .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (verificationToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = verificationToken.getUser();
        user.setVerified(true);
        userDao.updateUser(user);

        tokenDao.deleteToken(verificationToken);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Email verified successfully")
                .data("You can login now")
                .build();
    }

    public ResponseStructure<Integer> login(String email, String password) {
        User user = userDao.findVerifiedUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!user.getPassword().trim().equals(password.trim())) {
            throw new RuntimeException("Invalid credentials");
        }

        otpDao.deleteAll(user.getUserId());

        String otp = OtpGenerator.generateOtp();

        OtpVerification otpVerification = OtpVerification.builder()
                .otp(otp)
                .generatedAt(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(2))
                .user(user)
                .build();

        otpDao.saveOtp(otpVerification);

        user.setLoginStatus(LoginStatus.OTP_PENDING);
        userDao.updateUser(user);

        EmailConfiguration mail = EmailConfiguration.builder()
                .to(user.getEmail())
                .subject("Login OTP")
                .body("Your OTP is: " + otp)
                .build();

        emailService.sendMail(mail);

        return ResponseStructure.<Integer>builder()
                .statusCode(HttpStatus.OK.value())
                .message("OTP sent to registered email")
                .data(user.getUserId())
                .build();
    }

    public ResponseStructure<String> verifyOtp(String email, String otp) {
        User user = userDao.findVerifiedUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        OtpVerification otpEntity = otpDao.getLatestOtp(user.getUserId());

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!otpEntity.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setLoginStatus(LoginStatus.LOGGED_IN);
        userDao.updateUser(user);

        otpDao.deleteAll(user.getUserId());

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login successful")
                .data("LOGIN_SUCCESS")
                .build();
    }

    public ResponseStructure<String> resendOtp(String email) {
        User user = userDao.findVerifiedUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not verified"));

        OtpVerification lastOtp = otpDao.getLatestOtp(user.getUserId());

        long secondsPassed =
                Duration.between(lastOtp.getGeneratedAt(), LocalDateTime.now()).getSeconds();

        if (secondsPassed < 60) {
            throw new RuntimeException(
                    "Please wait " + (60 - secondsPassed) + " seconds before resending OTP");
        }

        String newOtp = OtpGenerator.generateOtp();

        OtpVerification otp = OtpVerification.builder()
                .otp(newOtp)
                .generatedAt(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(2))
                .user(user)
                .build();

        otpDao.saveOtp(otp);

        EmailConfiguration mail = EmailConfiguration.builder()
                .to(user.getEmail())
                .subject("Login OTP")
                .body("Your OTP is: " + newOtp)
                .build();

        emailService.sendMail(mail);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("OTP resent successfully")
                .data("OTP_RESENT")
                .build();
    }

    public ResponseStructure<String> updateProfile(String email, String name) {
        User user = userDao.findVerifiedUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(name);
        userDao.updateUser(user);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Profile updated")
                .data("SUCCESS")
                .build();
    }

    public ResponseStructure<String> changePassword(
            String email, String oldPwd, String newPwd) {

        User user = userDao.findVerifiedUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(oldPwd)) {
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(newPwd);
        userDao.updateUser(user);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Password changed")
                .data("SUCCESS")
                .build();
    }
}
```

---

## 46. EventService.java  
**Path:** `src/main/java/com/example/eventmanagement/service/EventService.java`

```java
package com.example.eventmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.EventRequest;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.util.EventStatus;

@Service
public class EventService {

	@Autowired
	private EventDao eventDao;

	@Autowired
	private UserDao userDao;

	public ResponseStructure<Event> createEvent(EventRequest request, int userId) {
		User creator = userDao.findVerifiedUserById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		Event event = Event.builder().eventName(request.getEventName()).description(request.getDescription())
				.venue(request.getVenue()).eventDate(request.getEventDate()).eventTime(request.getEventTime())
				.ticketPrice(request.getTicketPrice()).eventStatus(EventStatus.CREATED).creator(creator).build();

		eventDao.saveEvent(event);

		return ResponseStructure.<Event>builder().statusCode(HttpStatus.CREATED.value()).message("Event created")
				.data(event).build();
	}

	public ResponseStructure<List<Event>> viewAllEvents() {
		return ResponseStructure.<List<Event>>builder().statusCode(HttpStatus.OK.value()).message("All upcoming events")
				.data(eventDao.findUpcomingEvents()).build();
	}

	public ResponseStructure<String> deleteEvent(int eventId, int userId) {
		Event event = eventDao.findEventByIdAndCreator(eventId, userId)
				.orElseThrow(() -> new RuntimeException("Unauthorized delete"));

		eventDao.deleteEvent(event);

		return ResponseStructure.<String>builder().statusCode(HttpStatus.OK.value()).message("Event deleted")
				.data("Deleted successfully").build();
	}

	public ResponseStructure<List<?>> viewEventBookings(int eventId, int creatorId) {
		Event event = eventDao.findEventByIdAndCreator(eventId, creatorId)
				.orElseThrow(() -> new RuntimeException("Unauthorized access"));

		return ResponseStructure.<List<?>>builder().statusCode(HttpStatus.OK.value()).message("Bookings for your event")
				.data(event.getBookings()).build();
	}

	public ResponseStructure<Event> updateEvent(int eventId, int creatorId, EventRequest request) {
		Event event = eventDao.findEventByIdAndCreator(eventId, creatorId)
				.orElseThrow(() -> new RuntimeException("Unauthorized update"));

		event.setEventName(request.getEventName());
		event.setDescription(request.getDescription());
		event.setVenue(request.getVenue());
		event.setEventDate(request.getEventDate());
		event.setEventTime(request.getEventTime());
		event.setTicketPrice(request.getTicketPrice());

		return ResponseStructure.<Event>builder().statusCode(HttpStatus.OK.value()).message("Event updated")
				.data(eventDao.saveEvent(event)).build();
	}
}
```

---

## 47. TicketService.java  
**Path:** `src/main/java/com/example/eventmanagement/service/TicketService.java`

```java
package com.example.eventmanagement.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.BookingDao;
import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.TicketDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Booking;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.Ticket;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.util.PaymentStatus;
import com.example.eventmanagement.util.TicketStatus;

@Service
public class TicketService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private EventDao eventDao;

    @Autowired
    private BookingDao bookingDao;

    @Autowired
    private TicketDao ticketDao;

    public ResponseStructure<Ticket> bookEvent(int userId, int eventId) {
        User user = userDao.findVerifiedUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventDao.findEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .paymentStatus(PaymentStatus.SUCCESS)
                .bookingTime(LocalDateTime.now())
                .build();

        bookingDao.createBooking(booking);

        Ticket ticket = Ticket.builder()
                .booking(booking)
                .ticketStatus(TicketStatus.ACTIVE)
                .build();

        ticketDao.saveTicket(ticket);

        return ResponseStructure.<Ticket>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Ticket booked successfully")
                .data(ticket)
                .build();
    }
}
```

---

## 48. PaymentService.java  
**Path:** `src/main/java/com/example/eventmanagement/service/PaymentService.java`

```java
package com.example.eventmanagement.service;

import org.springframework.stereotype.Service;
import com.razorpay.*;
import org.json.JSONObject;

@Service
public class PaymentService {

    private static final String KEY = "rzp_test_xxxxxxxx";
    private static final String SECRET = "xxxxxxxx";

    public Order createOrder(double amount) throws RazorpayException {
        RazorpayClient client = new RazorpayClient(KEY, SECRET);

        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");

        return client.orders.create(options);
    }

    public boolean verifySignature(
            String orderId,
            String paymentId,
            String signature
    ) throws RazorpayException {

        String payload = orderId + "|" + paymentId;
        return Utils.verifySignature(payload, signature, SECRET);
    }
}
```

---

## 49. QuestionAnswerService.java  
**Path:** `src/main/java/com/example/eventmanagement/service/QuestionAnswerService.java`

```java
package com.example.eventmanagement.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.QuestionAnswerDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.QuestionAnswer;
import com.example.eventmanagement.model.User;

@Service
public class QuestionAnswerService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private EventDao eventDao;

    @Autowired
    private QuestionAnswerDao qaDao;

    public ResponseStructure<QuestionAnswer> askQuestion(
            int userId, int eventId, String question) {

        User user = userDao.findVerifiedUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventDao.findEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        QuestionAnswer qa = QuestionAnswer.builder()
                .question(question)
                .event(event)
                .askedBy(user)
                .build();

        return ResponseStructure.<QuestionAnswer>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Question submitted")
                .data(qaDao.save(qa))
                .build();
    }

    public ResponseStructure<QuestionAnswer> answerQuestion(
            int qaId, int creatorId, String answer) {

        QuestionAnswer qa = qaDao.findByQaId(qaId);

        Event event = qa.getEvent();

        if (event.getCreator().getUserId() != creatorId)
            throw new RuntimeException("Only event creator can answer");

        qa.setAnswer(answer);

        return ResponseStructure.<QuestionAnswer>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Answer added")
                .data(qaDao.save(qa))
                .build();
    }

    public ResponseStructure<List<QuestionAnswer>> viewQuestions(int eventId) {

        return ResponseStructure.<List<QuestionAnswer>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event questions")
                .data(qaDao.findByEventId(eventId))
                .build();
    }
}
```

---

## 50. EmailService.java  
**Path:** `src/main/java/com/example/eventmanagement/service/EmailService.java`

```java
package com.example.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.EmailConfiguration;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendMail(EmailConfiguration config) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(config.getTo());
        message.setSubject(config.getSubject());
        message.setText(config.getBody());
        mailSender.send(message);
    }
}
```

---

## 51. LinkGeneratorService.java  
**Path:** `src/main/java/com/example/eventmanagement/service/LinkGeneratorService.java`

```java
package com.example.eventmanagement.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class LinkGeneratorService {

    public String generateVerificationLink() {
        return UUID.randomUUID().toString();
    }
}
```

---

**End of backend code.**  

- **pom.xml**: Keep your existing Spring Boot + JPA + MySQL + Mail + Lombok + Razorpay dependencies.  
- **application.properties**: Set datasource URL, username, password, JPA settings, and mail (host, port, username, password).  
- In **PaymentService.java** replace `KEY` and `SECRET` with your Razorpay test keys.
