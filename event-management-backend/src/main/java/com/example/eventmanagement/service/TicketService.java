package com.example.eventmanagement.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.BookingDao;
import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.TicketDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.util.PaymentStatus;
import com.example.eventmanagement.util.TicketStatus;
import com.example.eventmanagement.model.Booking;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.Ticket;
import com.example.eventmanagement.model.User;

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

        // Check if event has max attendees limit
        if (event.getMaxAttendees() != null) {
            long currentBookings = bookingDao.findByEvent_EventId(eventId).stream()
                    .filter(b -> b.getPaymentStatus() == PaymentStatus.COMPLETED)
                    .count();
            
            if (currentBookings >= event.getMaxAttendees()) {
                throw new RuntimeException("Event is fully booked");
            }
        }

        // Check if user already booked this event
        boolean alreadyBooked = bookingDao.findByUser_UserId(userId).stream()
                .anyMatch(b -> b.getEvent().getEventId() == eventId);
        
        if (alreadyBooked) {
            throw new RuntimeException("You have already booked this event");
        }

        Booking booking = Booking.builder()
        	    .user(user)
        	    .event(event)
        	    .paymentStatus(PaymentStatus.PENDING)
        	    .bookingTime(LocalDateTime.now())
        	    .build();

        bookingDao.createBooking(booking);

        Ticket ticket = Ticket.builder()
                .booking(booking)
                .ticketStatus(TicketStatus.BOOKED)
                .build();

        ticketDao.saveTicket(ticket);

        return ResponseStructure.<Ticket>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Ticket booked successfully. Please complete payment to confirm.")
                .data(ticket)
                .build();
    }

    public ResponseStructure<Ticket> confirmTicket(int ticketId) {
        Ticket ticket = ticketDao.findTicketById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        Booking booking = ticket.getBooking();
        booking.setPaymentStatus(PaymentStatus.COMPLETED);
        bookingDao.updateBooking(booking);

        ticket.setTicketStatus(TicketStatus.ACTIVE);
        ticketDao.saveTicket(ticket);

        return ResponseStructure.<Ticket>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Ticket confirmed successfully")
                .data(ticket)
                .build();
    }

    public ResponseStructure<List<Ticket>> getUserTickets(int userId) {
        User user = userDao.findUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Ticket> tickets = bookingDao.findByUser_UserId(userId).stream()
                .map(booking -> ticketDao.findByBookingId(booking.getBookingId()).orElse(null))
                .filter(ticket -> ticket != null)
                .toList();

        return ResponseStructure.<List<Ticket>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User tickets retrieved")
                .data(tickets)
                .build();
    }
}
