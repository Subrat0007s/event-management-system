package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    @Query("select b from Booking b where b.user.userId = ?1")
    List<Booking> findBookingsByUser(int userId);

    List<Booking> findByUser_UserId(int userId);

    @Query("select b from Booking b where b.event.eventId = ?1")
    List<Booking> findBookingsByEvent(int eventId);

    List<Booking> findByEvent_EventId(int eventId);

    @Query("select count(b) from Booking b where b.event.eventId = ?1")
    long countBookingsForEvent(int eventId);
}
