package com.example.eventmanagement.dao;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.example.eventmanagement.model.OtpVerification;
import com.example.eventmanagement.repository.OtpVerificationRepository;

@Repository
public class OtpVerificationDao {

	@Autowired
	private OtpVerificationRepository repository;

	public OtpVerification getLatestOtp(int userId) {
		List<OtpVerification> list = repository.findLatestOtp(userId);
		if (list.isEmpty()) {
			throw new RuntimeException("OTP not found");
		}
		return list.get(0);
	}

	public void deleteAll(int userId) {
		repository.deleteByUser_UserId(userId);
	}

	public void saveOtp(OtpVerification otp) {
		repository.save(otp);
	}
}
