package com.example.eventmanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.eventmanagement.model.OtpVerification;

public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Integer> {

	@Query("""
			SELECT o FROM OtpVerification o
			WHERE o.user.userId = ?1
			ORDER BY o.generatedAt DESC
			""")
	List<OtpVerification> findLatestOtp(int userId);

	void deleteByUser_UserId(int userId);
}
