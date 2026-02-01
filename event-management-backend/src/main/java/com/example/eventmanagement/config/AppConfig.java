package com.example.eventmanagement.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;

@Configuration
public class AppConfig {

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        System.out.println("=== APP CONFIG INIT ===");
        System.out.println("Frontend URL from properties: " + frontendUrl);
        System.out.println("=== APP CONFIG INIT END ===");
    }

    public String getFrontendUrl() {
        return frontendUrl;
    }
}
