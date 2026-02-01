package com.example.eventmanagement.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.eventmanagement.dto.EmailConfiguration;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendMail(EmailConfiguration config) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(config.getTo());
        message.setSubject(config.getSubject());
        message.setText(config.getBody());
        mailSender.send(message);
    }
}
