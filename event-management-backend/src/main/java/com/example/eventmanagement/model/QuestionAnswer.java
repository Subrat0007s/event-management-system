package com.example.eventmanagement.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions_answers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuestionAnswer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int qaId;

	@Column(name = "question", nullable = false)
	private String question;

	@Column(name = "answer")
	private String answer;

	@Column(name = "asked_at")
	private LocalDateTime askedAt;

	@Column(name = "answered_at")
	private LocalDateTime answeredAt;

	@ManyToOne
	@JoinColumn(name = "event_id")
	private Event event;

	@ManyToOne
	@JoinColumn(name = "asked_by")
	private User askedBy;

	@ManyToOne
	@JoinColumn(name = "answered_by")
	private User answeredBy;
}
