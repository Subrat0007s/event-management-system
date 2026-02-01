package com.example.eventmanagement.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponse {

    private int eventId;
    private String eventName;
    private String venue;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private double ticketPrice;
    private String creatorName;
}
