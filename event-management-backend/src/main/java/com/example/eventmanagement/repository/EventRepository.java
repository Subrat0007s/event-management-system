package com.example.eventmanagement.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.eventmanagement.model.Event;
import com.example.eventmanagement.util.EventCategory;
import com.example.eventmanagement.util.PrivacySettings;

public interface EventRepository extends JpaRepository<Event, Integer> {

    @Query("select e from Event e where e.creator.userId = ?1")
    List<Event> findEventsByCreator(int userId);

    @Query("select e from Event e where e.eventDate >= ?1")
    List<Event> findUpcomingEvents(LocalDate date);

    @Query("select e from Event e where lower(e.eventName) like lower(concat('%', ?1, '%'))")
    List<Event> searchByEventName(String keyword);

    @Query("select e from Event e where e.eventId = ?1 and e.creator.userId = ?2")
    Optional<Event> findEventByIdAndCreator(int eventId, int userId);

    List<Event> findByEventCategory(EventCategory category);

    List<Event> findByPrivacySettings(PrivacySettings privacySettings);

    @Query("select e from Event e where e.privacySettings = 'PUBLIC' and e.eventDate >= :date")
    List<Event> findPublicUpcomingEvents(@Param("date") LocalDate date);

    @Query("select e from Event e where " +
           "(lower(e.eventName) like lower(concat('%', :keyword, '%')) or " +
           "lower(e.description) like lower(concat('%', :keyword, '%')) or " +
           "lower(e.venue) like lower(concat('%', :keyword, '%'))) and " +
           "e.privacySettings = 'PUBLIC'")
    List<Event> searchPublicEvents(@Param("keyword") String keyword);

    @Query("select e from Event e where " +
           "e.privacySettings = 'PUBLIC' and " +
           "e.eventDate >= :startDate and e.eventDate <= :endDate and " +
           "(:category is null or e.eventCategory = :category)")
    List<Event> findEventsWithFilters(@Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate,
                                      @Param("category") EventCategory category);

    @Query("select e from Event e where e.privacySettings = 'PUBLIC' order by e.eventDate asc")
    List<Event> findPublicEventsOrderByDate();
}
