# Event Management Backend (Spring Boot)

Simple REST API for the event management system. **No Spring Security** – authentication is handled via email OTP and verification links.

## Tech Stack

- Java 21
- Spring Boot 4.x
- Spring Data JPA
- MySQL
- Spring Mail (email verification / OTP)
- Razorpay (payments)
- Lombok

## Project Structure

```
src/main/java/com/example/eventmanagement/
├── EventManagementBackendApplication.java
├── config/
│   └── WebConfig.java              # CORS configuration
├── controller/
│   ├── UserController.java        # /user - register, login, OTP, profile
│   ├── EventController.java       # /events - CRUD, bookings
│   ├── TicketController.java      # /tickets - book
│   ├── PaymentController.java     # /payment - create-order, verify
│   └── QuestionAnswerController.java  # /qa - ask, answer, view
├── service/
│   ├── UserService.java
│   ├── EventService.java
│   ├── TicketService.java
│   ├── PaymentService.java
│   ├── QuestionAnswerService.java
│   ├── EmailService.java
│   └── LinkGeneratorService.java
├── dao/
│   ├── UserDao.java
│   ├── EventDao.java
│   ├── BookingDao.java
│   ├── TicketDao.java
│   ├── OtpVerificationDao.java
│   ├── EmailVerificationTokenDao.java
│   ├── QuestionAnswerDao.java
│   └── PaymentDao.java
├── repository/   (JpaRepository interfaces)
├── model/        (JPA entities: User, Event, Booking, Ticket, etc.)
├── dto/          (Request/Response DTOs)
├── exception/
│   └── GlobalExceptionHandler.java
└── util/         (Enums: LoginStatus, EventStatus, PaymentStatus, etc.)
```

## API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /user/register | Register (sends verification link to email) |
| GET | /user/verify?token= | Verify email via link |
| POST | /user/login | Login (sends OTP to email) |
| POST | /user/verify-otp | Verify OTP (email, otp) |
| POST | /user/resend-otp | Resend OTP |
| PUT | /user/update-profile | Update name (email, name) |
| PUT | /user/change-password | Change password |
| POST | /events/create?userId= | Create event |
| GET | /events/all | List upcoming events |
| GET | /events/bookings?eventId=&creatorId= | List bookings for event |
| PUT | /events/update | Update event |
| DELETE | /events/delete | Delete event |
| POST | /tickets/book?userId=&eventId= | Book ticket |
| POST | /payment/create-order | Create Razorpay order (body: userId, eventId, amount) |
| POST | /payment/verify | Verify payment signature |
| POST | /qa/ask | Ask question |
| POST | /qa/answer | Answer question (creator only) |
| GET | /qa/view?eventId= | List Q&A for event |

## Setup

1. **MySQL**: Create database `event_management` (or use `createDatabaseIfNotExist=true` in `application.properties`).
2. **application.properties**: Set `spring.datasource.username`, `spring.datasource.password`, and mail credentials.
3. **Razorpay**: Set KEY and SECRET in `PaymentService.java` (or move to properties).
4. **CORS**: Frontend origin is allowed in `WebConfig.java` (e.g. `http://localhost:5173`).

## Run

```bash
./mvnw spring-boot:run
```

Server runs on port 8080.
