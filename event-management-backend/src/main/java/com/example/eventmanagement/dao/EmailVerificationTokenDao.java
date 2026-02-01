package com.example.eventmanagement.dao;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.EmailVerificationToken;
import com.example.eventmanagement.repository.EmailVerificationTokenRepository;

@Repository
public class EmailVerificationTokenDao {

    @Autowired
    private EmailVerificationTokenRepository tokenRepository;

    public EmailVerificationToken saveToken(EmailVerificationToken token) {
        return tokenRepository.save(token);
    }

    public Optional<EmailVerificationToken> findByToken(String token) {
        return tokenRepository.findByToken(token);
    }

    public void deleteToken(EmailVerificationToken token) {
        tokenRepository.delete(token);
    }
}
