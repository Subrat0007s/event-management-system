package com.example.eventmanagement.exception;

@SuppressWarnings("serial")
public class InvalidOtpException extends RuntimeException {
    public InvalidOtpException(String message) {
        super(message);
    }
}
