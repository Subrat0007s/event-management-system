package com.example.eventmanagement.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.model.Ticket;
import com.example.eventmanagement.service.TicketService;

@CrossOrigin
@RestController
@RequestMapping("/tickets")
public class TicketController {

	@Autowired
	private TicketService ticketService;

	@PostMapping("/book")
	public ResponseStructure<Ticket> bookTicket(@RequestParam int userId, @RequestParam int eventId) {
		return ticketService.bookEvent(userId, eventId);
	}

	@PostMapping("/confirm/{ticketId}")
	public ResponseStructure<Ticket> confirmTicket(@PathVariable int ticketId) {
		return ticketService.confirmTicket(ticketId);
	}

	@GetMapping("/user/{userId}")
	public ResponseStructure<List<Ticket>> getUserTickets(@PathVariable int userId) {
		return ticketService.getUserTickets(userId);
	}
}
