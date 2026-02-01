package com.example.eventmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.EmailVerificationToken;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Integer> {

	@Query("select e from EmailVerificationToken e where e.token = ?1")
	Optional<EmailVerificationToken> findByToken(String token);
}
