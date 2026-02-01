package com.example.eventmanagement.dto;

import java.time.LocalDate;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {

	private String name;
	private LocalDate dob;
	private String email;
	private String password;
}
