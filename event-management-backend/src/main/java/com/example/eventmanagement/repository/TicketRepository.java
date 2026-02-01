package com.example.eventmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.Ticket;

public interface TicketRepository extends JpaRepository<Ticket, Integer> {

    @Query("select t from Ticket t where t.booking.bookingId = ?1")
    Optional<Ticket> findByBookingId(int bookingId);

    Optional<Ticket> findByBooking_BookingId(int bookingId);

    @Query("select t from Ticket t where t.ticketStatus = 'ACTIVE'")
    Optional<Ticket> findActiveTickets();
}
