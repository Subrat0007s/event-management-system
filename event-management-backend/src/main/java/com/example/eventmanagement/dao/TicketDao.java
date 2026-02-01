package com.example.eventmanagement.dao;



import java.util.Optional;



import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Repository;



import com.example.eventmanagement.util.TicketStatus;

import com.example.eventmanagement.model.Ticket;

import com.example.eventmanagement.repository.TicketRepository;



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

    public Optional<Ticket> findTicketById(int ticketId) {
        return ticketRepository.findById(ticketId);
    }

    public Optional<Ticket> findByBooking_BookingId(int bookingId) {
        return ticketRepository.findByBooking_BookingId(bookingId);
    }

}
