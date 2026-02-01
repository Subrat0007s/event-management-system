package com.example.eventmanagement.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import com.example.eventmanagement.util.EventCategory;
import com.example.eventmanagement.util.PrivacySettings;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRequest {

    private String eventName;
    private String description;
    private String venue;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private Double ticketPrice;
    private Integer maxAttendees;
    private String eventImageUrl;
    private EventCategory eventCategory;
    private PrivacySettings privacySettings;
    private Integer creatorId;
}
