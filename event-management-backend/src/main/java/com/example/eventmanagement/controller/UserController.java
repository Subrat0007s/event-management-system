package com.example.eventmanagement.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.eventmanagement.dto.LoginRequest;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.dto.SocialLoginRequest;
import com.example.eventmanagement.dto.UserRequest;
import com.example.eventmanagement.service.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseStructure<String> register(@RequestBody UserRequest request) {
		return userService.registerUser(request);
	}

	@GetMapping("/verify")
	public ResponseStructure<String> verifyEmail(@RequestParam String token) {
		return userService.verifyUser(token);
	}

	@GetMapping("/check-verification")
	public ResponseStructure<Boolean> checkVerification(@RequestParam String email) {
		return userService.checkVerificationStatus(email);
	}

	@GetMapping("/debug-token")
public ResponseStructure<String> debugToken(@RequestParam String token) {
    return userService.debugToken(token);
}

@GetMapping("/debug-user")
	public ResponseStructure<String> debugUser(@RequestParam String email) {
		return userService.debugUser(email);
	}

	@GetMapping("/test-config")
	public ResponseStructure<String> testConfig() {
		return userService.testConfig();
	}

	@PostMapping("/login")
	public ResponseStructure<Integer> login(@RequestBody LoginRequest request) {
		return userService.login(request.getEmail(), request.getPassword());
	}

	@PostMapping("/logout")
	public ResponseStructure<String> logout(@RequestParam int userId) {
		return userService.logout(userId);
	}

	@PostMapping("/verify-otp")
	public ResponseStructure<String> verifyOtp(@RequestParam String email, @RequestParam String otp) {
		return userService.verifyOtp(email, otp);
	}

	@PostMapping("/resend-otp")
	public ResponseStructure<String> resendOtp(@RequestParam String email) {
		return userService.resendOtp(email);
	}

	@PutMapping("/update-profile")
	public ResponseStructure<String> updateProfile(@RequestParam String email, @RequestParam String name) {
		return userService.updateProfile(email, name);
	}

	@PutMapping("/change-password")
	public ResponseStructure<String> changePassword(@RequestParam String email, @RequestParam String oldPwd,
			@RequestParam String newPwd) {
		return userService.changePassword(email, oldPwd, newPwd);
	}

	@PostMapping("/social-login")
	public ResponseStructure<Integer> socialLogin(@RequestBody SocialLoginRequest request) {
		return userService.socialLogin(request);
	}

	@PostMapping("/link-social/{userId}")
	public ResponseStructure<String> linkSocialAccount(@PathVariable int userId,
			@RequestBody SocialLoginRequest request) {
		return userService.linkSocialAccount(userId, request);
	}
}
