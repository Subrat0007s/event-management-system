package com.example.eventmanagement.dao;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.repository.EventRepository;
import com.example.eventmanagement.util.EventCategory;

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

    public List<Event> findPublicEvents() {
        return eventRepository.findPublicEventsOrderByDate();
    }

    public List<Event> searchPublicEvents(String keyword) {
        return eventRepository.searchPublicEvents(keyword);
    }

    public List<Event> findEventsWithFilters(LocalDate startDate, LocalDate endDate, EventCategory category) {
        return eventRepository.findEventsWithFilters(startDate, endDate, category);
    }

    public List<Event> findEventsByCategory(EventCategory category) {
        return eventRepository.findByEventCategory(category);
    }

    public void deleteEvent(Event event) {
        eventRepository.delete(event);
    }
}
