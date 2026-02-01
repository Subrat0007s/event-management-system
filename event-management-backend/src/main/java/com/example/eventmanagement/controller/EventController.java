package com.example.eventmanagement.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.EventRequest;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.service.EventService;
import com.example.eventmanagement.util.EventCategory;
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

	@GetMapping("/public")
	public ResponseStructure<List<Event>> getPublicEvents() {
		return eventService.getPublicEvents();
	}

	@GetMapping("/search")
	public ResponseStructure<List<Event>> searchEvents(@RequestParam String keyword) {
		return eventService.searchEvents(keyword);
	}

	@GetMapping("/filter")
	public ResponseStructure<List<Event>> getEventsWithFilters(
			@RequestParam(required = false) LocalDate startDate,
			@RequestParam(required = false) LocalDate endDate,
			@RequestParam(required = false) EventCategory category) {
		return eventService.getEventsWithFilters(startDate, endDate, category);
	}

	@GetMapping("/category/{category}")
	public ResponseStructure<List<Event>> getEventsByCategory(@PathVariable EventCategory category) {
		return eventService.getEventsByCategory(category);
	}

	@GetMapping("/my-events")
	public ResponseStructure<List<Event>> getMyEvents(@RequestParam int userId) {
		return eventService.getEventsByCreator(userId);
	}

	@GetMapping("/details")
	public ResponseStructure<Event> getEventDetails(@RequestParam int eventId) {
		return eventService.getEventDetails(eventId);
	}

}
