package com.example.eventmanagement.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.BookingDao;
import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Booking;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.util.EventStatus;
import com.example.eventmanagement.util.PaymentStatus;

@Service
public class DashboardService {

    @Autowired
    private EventDao eventDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private BookingDao bookingDao;

    @SuppressWarnings("unused")
	public ResponseStructure<Map<String, Object>> getOrganizerDashboard(int userId) {
        User organizer = userDao.findVerifiedUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Event> events = eventDao.findEventsByCreator(userId);
        
        int totalEvents = events.size();
        int upcomingEvents = (int) events.stream()
                .filter(e -> e.getEventStatus() == EventStatus.CREATED || e.getEventStatus() == EventStatus.UPCOMING)
                .count();
        
        int totalBookings = 0;
        double totalRevenue = 0.0;
        
        for (Event event : events) {
            List<Booking> bookings = bookingDao.findByEvent_EventId(event.getEventId());
            totalBookings += bookings.size();
            
            totalRevenue += bookings.stream()
                    .filter(b -> b.getPaymentStatus() == PaymentStatus.COMPLETED)
                    .mapToDouble(b -> event.getTicketPrice())
                    .sum();
        }

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("totalEvents", totalEvents);
        dashboard.put("upcomingEvents", upcomingEvents);
        dashboard.put("totalBookings", totalBookings);
        dashboard.put("totalRevenue", totalRevenue);
        dashboard.put("recentEvents", events.stream().limit(5).toList());

        return ResponseStructure.<Map<String, Object>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Dashboard data retrieved")
                .data(dashboard)
                .build();
    }

    public ResponseStructure<Map<String, Object>> getEventDetails(
            int eventId, int userId) {
        
        Event event = eventDao.findEventById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        
        if (event.getCreator().getUserId() != userId) {
            throw new RuntimeException("Unauthorized access");
        }

        List<Booking> bookings = bookingDao.findByEvent_EventId(eventId);
        
        Map<String, Object> details = new HashMap<>();
        details.put("event", event);
        details.put("totalBookings", bookings.size());
        details.put("confirmedBookings", bookings.stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.COMPLETED)
                .count());
        details.put("pendingBookings", bookings.stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.PENDING)
                .count());
        details.put("revenue", bookings.stream()
                .filter(b -> b.getPaymentStatus() == PaymentStatus.COMPLETED)
                .mapToDouble(b -> event.getTicketPrice())
                .sum());
        details.put("recentBookings", bookings.stream().limit(10).toList());

        return ResponseStructure.<Map<String, Object>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Event details retrieved")
                .data(details)
                .build();
    }
}
