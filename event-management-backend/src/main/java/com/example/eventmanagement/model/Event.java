package com.example.eventmanagement.model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import com.example.eventmanagement.util.EventCategory;
import com.example.eventmanagement.util.EventStatus;
import com.example.eventmanagement.util.PrivacySettings;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "events")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Event {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "event_id")
	private int eventId;

	@Column(name = "event_name", nullable = false)
	private String eventName;

	@Column(name = "description", length = 1000)
	private String description;

	@Column(name = "venue", nullable = false)
	private String venue;

	@Column(name = "event_date", nullable = false)
	private LocalDate eventDate;

	@Column(name = "event_time", nullable = false)
	private LocalTime eventTime;

	@Column(name = "ticket_price", nullable = false)
	private double ticketPrice;

	@Column(name = "max_attendees")
	private Integer maxAttendees;

	@Column(name = "event_image_url")
	private String eventImageUrl;

	@Enumerated(EnumType.STRING)
	@Column(name = "event_category")
	private EventCategory eventCategory;

	@Enumerated(EnumType.STRING)
	@Column(name = "privacy_settings")
	private PrivacySettings privacySettings;

	@Enumerated(EnumType.STRING)
	@Column(name = "event_status")
	private EventStatus eventStatus;

	@Column(name = "created_at")
	private LocalDate createdAt;

	@ManyToOne
	@JoinColumn(name = "creator_id")
	private User creator;

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Booking> bookings;

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<QuestionAnswer> questions;

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<Poll> polls;

	@OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
	@JsonIgnore
	private List<ForumPost> forumPosts;
}
