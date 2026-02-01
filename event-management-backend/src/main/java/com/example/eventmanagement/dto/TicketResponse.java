package com.example.eventmanagement.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {

    private int ticketId;
    private int bookingId;
    private String eventName;
    private String ticketStatus;
}
