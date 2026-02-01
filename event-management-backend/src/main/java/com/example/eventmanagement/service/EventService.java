package com.example.eventmanagement.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dao.EventDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.EventRequest;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.util.EventCategory;
import com.example.eventmanagement.util.EventStatus;
import com.example.eventmanagement.util.PrivacySettings;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.model.User;

@Service
public class EventService {

	@Autowired
	private EventDao eventDao;

	@Autowired
	private UserDao userDao;

	public ResponseStructure<Event> createEvent(EventRequest request, int userId) {

		User creator = userDao.findUserById(userId).orElseThrow(() -> new RuntimeException("User not found"));

		// Validate required fields
		if (request.getEventName() == null || request.getEventName().trim().isEmpty()) {
			throw new RuntimeException("Event name is required");
		}
		if (request.getVenue() == null || request.getVenue().trim().isEmpty()) {
			throw new RuntimeException("Venue is required");
		}
		if (request.getEventDate() == null) {
			throw new RuntimeException("Event date is required");
		}

		Event event = Event.builder()
				.eventName(request.getEventName())
				.description(request.getDescription() != null ? request.getDescription() : "")
				.venue(request.getVenue())
				.eventDate(request.getEventDate())
				.eventTime(request.getEventTime() != null ? request.getEventTime() : LocalTime.of(18, 0))
				.ticketPrice(request.getTicketPrice() != null ? request.getTicketPrice() : 0.0)
				.maxAttendees(request.getMaxAttendees() != null ? request.getMaxAttendees() : 100)
				.eventImageUrl(request.getEventImageUrl() != null ? request.getEventImageUrl() : "")
				.eventCategory(request.getEventCategory() != null ? request.getEventCategory() : EventCategory.OTHER)
				.privacySettings(request.getPrivacySettings() != null ? request.getPrivacySettings() : PrivacySettings.PUBLIC)
				.eventStatus(EventStatus.CREATED)
				.createdAt(LocalDate.now())
				.creator(creator)
				.build();

		eventDao.saveEvent(event);

		return ResponseStructure.<Event>builder()
				.statusCode(HttpStatus.CREATED.value())
				.message("Event created")
				.data(event)
				.build();
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
		event.setMaxAttendees(request.getMaxAttendees());
		event.setEventImageUrl(request.getEventImageUrl());
		if (request.getEventCategory() != null) {
			event.setEventCategory(request.getEventCategory());
		}
		if (request.getPrivacySettings() != null) {
			event.setPrivacySettings(request.getPrivacySettings());
		}

		return ResponseStructure.<Event>builder()
				.statusCode(HttpStatus.OK.value())
				.message("Event updated")
				.data(eventDao.saveEvent(event))
				.build();
	}

	public ResponseStructure<List<Event>> getPublicEvents() {
		return ResponseStructure.<List<Event>>builder()
				.statusCode(HttpStatus.OK.value())
				.message("All public events")
				.data(eventDao.findPublicEvents())
				.build();
	}

	public ResponseStructure<List<Event>> searchEvents(String keyword) {
		return ResponseStructure.<List<Event>>builder()
				.statusCode(HttpStatus.OK.value())
				.message("Search results")
				.data(eventDao.searchPublicEvents(keyword))
				.build();
	}

	public ResponseStructure<List<Event>> getEventsWithFilters(LocalDate startDate, LocalDate endDate, EventCategory category) {
		return ResponseStructure.<List<Event>>builder()
				.statusCode(HttpStatus.OK.value())
				.message("Filtered events")
				.data(eventDao.findEventsWithFilters(startDate, endDate, category))
				.build();
	}

	public ResponseStructure<List<Event>> getEventsByCategory(EventCategory category) {
		return ResponseStructure.<List<Event>>builder()
				.statusCode(HttpStatus.OK.value())
				.message("Events by category")
				.data(eventDao.findEventsByCategory(category))
				.build();
	}

	public ResponseStructure<List<Event>> getEventsByCreator(int userId) {
        List<Event> events = eventDao.findEventsByCreator(userId);
        
        return ResponseStructure.<List<Event>>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Events by creator")
                .data(events)
                .build();
    }

	public ResponseStructure<Event> getEventDetails(int eventId) {
		Event event = eventDao.findEventById(eventId)
				.orElseThrow(() -> new RuntimeException("Event not found"));
		
		return ResponseStructure.<Event>builder()
				.statusCode(HttpStatus.OK.value())
				.message("Event details")
				.data(event)
				.build();
	}

}
