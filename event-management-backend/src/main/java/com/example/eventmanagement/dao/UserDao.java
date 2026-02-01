package com.example.eventmanagement.dao;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.util.LoginStatus;

@Repository
public class UserDao {

	@Autowired
	private UserRepository userRepository;

	public User saveUser(User user) {
		user.setCreatedAt(LocalDateTime.now());
		user.setLoginStatus(LoginStatus.LOGGED_OUT);
		return userRepository.save(user);
	}

	public Optional<User> findByEmail(String email) {
		return userRepository.findByEmail(email);
	}

	public Optional<User> findVerifiedUserByEmail(String email) {
		return userRepository.findVerifiedUserByEmail(email);
	}

	public Optional<User> findVerifiedUserById(int userId) {
		return userRepository.findVerifiedUserById(userId);
	}

	public Optional<User> findByGoogleId(String googleId) {
		return userRepository.findByGoogleId(googleId);
	}

	public Optional<User> findByFacebookId(String facebookId) {
		return userRepository.findByFacebookId(facebookId);
	}

	public Optional<User> findUserById(int userId) {
		return userRepository.findById(userId);
	}

	@Transactional
	public User updateUser(User user) {
        System.out.println("=== USER UPDATE START ===");
        System.out.println("Updating user: " + user.getEmail());
        System.out.println("User ID: " + user.getUserId());
        System.out.println("Verified status before save: " + user.isVerified());
        System.out.println("Login status: " + user.getLoginStatus());
        
        User savedUser = userRepository.save(user);
        
        System.out.println("User saved. Verified status after save: " + savedUser.isVerified());
        System.out.println("=== USER UPDATE COMPLETE ===");
        
        return savedUser;
    }
}
