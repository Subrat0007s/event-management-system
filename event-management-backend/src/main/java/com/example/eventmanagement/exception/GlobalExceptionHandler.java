package com.example.eventmanagement.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.ResponseStructure;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(RuntimeException.class)
	public ResponseEntity<ResponseStructure<String>> handleRuntime(RuntimeException ex) {

		ResponseStructure<String> response = ResponseStructure.<String>builder()
				.statusCode(HttpStatus.BAD_REQUEST.value()).message(ex.getMessage()).data("ERROR").build();

		return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ResponseStructure<String>> handleException(Exception ex) {

		ResponseStructure<String> response = ResponseStructure.<String>builder()
				.statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value()).message("Internal server error").data("ERROR")
				.build();

		return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
