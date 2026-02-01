package com.example.eventmanagement.dao;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.util.PaymentStatus;
import com.example.eventmanagement.model.Booking;
import com.example.eventmanagement.repository.BookingRepository;

@Repository
public class BookingDao {

    @Autowired
    private BookingRepository bookingRepository;

    public Booking createBooking(Booking booking) {
        booking.setBookingTime(LocalDateTime.now());
        booking.setPaymentStatus(PaymentStatus.PENDING);
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Booking booking) {
        return bookingRepository.save(booking);
    }

    public List<Booking> findBookingsByUser(int userId) {
        return bookingRepository.findBookingsByUser(userId);
    }

    public List<Booking> findByUser_UserId(int userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    public List<Booking> findBookingsByEvent(int eventId) {
        return bookingRepository.findBookingsByEvent(eventId);
    }

    public List<Booking> findByEvent_EventId(int eventId) {
        return bookingRepository.findByEvent_EventId(eventId);
    }

    public long countBookingsForEvent(int eventId) {
        return bookingRepository.countBookingsForEvent(eventId);
    }

    public void deleteBooking(Booking booking) {
        bookingRepository.delete(booking);
    }
}
