package com.example.eventmanagement.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class LinkGeneratorService {

    public String generateVerificationLink() {
        return UUID.randomUUID().toString();
    }
}
