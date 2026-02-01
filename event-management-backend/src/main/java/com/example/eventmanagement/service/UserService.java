package com.example.eventmanagement.service;

import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.eventmanagement.config.AppConfig;
import com.example.eventmanagement.dao.EmailVerificationTokenDao;
import com.example.eventmanagement.dao.OtpVerificationDao;
import com.example.eventmanagement.dao.UserDao;
import com.example.eventmanagement.dto.EmailConfiguration;
import com.example.eventmanagement.dto.ResponseStructure;
import com.example.eventmanagement.dto.SocialLoginRequest;
import com.example.eventmanagement.dto.UserRequest;
import com.example.eventmanagement.model.EmailVerificationToken;
import com.example.eventmanagement.model.OtpVerification;
import com.example.eventmanagement.model.User;
import com.example.eventmanagement.repository.UserRepository;
import com.example.eventmanagement.util.LoginStatus;
import com.example.eventmanagement.util.OtpGenerator;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private LinkGeneratorService linkGeneratorService;

    @Autowired
    private EmailVerificationTokenDao tokenDao;

    @Autowired
    private OtpVerificationDao otpDao;

    @Autowired
    private AppConfig appConfig;

    /* ================= REGISTER ================= */

    public ResponseStructure<String> registerUser(UserRequest request) {

        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User already registered with this email");
        }

        User user = User.builder()
                .name(request.getName())
                .dob(request.getDob())
                .email(request.getEmail())
                .password(request.getPassword())
                .verified(false)
                .loginStatus(LoginStatus.LOGGED_OUT)
                .createdAt(LocalDateTime.now())
                .build();

        userDao.saveUser(user);

        String token = linkGeneratorService.generateVerificationLink();

        EmailVerificationToken verificationToken =
                EmailVerificationToken.builder()
                        .token(token)
                        .user(user)
                        .generatedAt(LocalDateTime.now())
                        .expiryTime(LocalDateTime.now().plusHours(24)) // 24 hours for testing
                        .build();

        tokenDao.saveToken(verificationToken);

        // Generate verification link with proper frontend URL
        String baseUrl = appConfig.getFrontendUrl();
        String verificationLink = baseUrl + "/verify-email?token=" + token;
        
        // Fallback for localhost testing
        if (baseUrl.contains("10.156.158.71") && !baseUrl.contains("localhost")) {
            verificationLink = "http://localhost:3000/verify-email?token=" + token;
        }

        EmailConfiguration mail = EmailConfiguration.builder()
                .to(user.getEmail())
                .subject("Verify Your Email")
                .body("Click to verify: " + verificationLink)
                .build();

        System.out.println("=== VERIFICATION LINK GENERATED ===");
        System.out.println("User Email: " + user.getEmail());
        System.out.println("Token: " + token);
        System.out.println("Frontend URL from config: " + appConfig.getFrontendUrl());
        System.out.println("Verification Link: " + verificationLink);
        System.out.println("=== VERIFICATION LINK END ===");

        emailService.sendMail(mail);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.CREATED.value())
                .message("Registration successful. Please check your email to verify your account.")
                .data("Check your inbox for verification link")
                .build();
    }

    /* ================= DEBUG TOKEN ================= */

    public ResponseStructure<String> debugToken(String token) {
        try {
            EmailVerificationToken verificationToken = tokenDao.findByToken(token)
                    .orElse(null);

            if (verificationToken == null) {
                return ResponseStructure.<String>builder()
                        .statusCode(HttpStatus.NOT_FOUND.value())
                        .message("Token not found in database")
                        .data("Token: " + token + " - STATUS: NOT FOUND")
                        .build();
            }

            User user = verificationToken.getUser();
            String status = "Token: " + token + 
                    "\nUser: " + user.getEmail() + 
                    "\nGenerated: " + verificationToken.getGeneratedAt() +
                    "\nExpires: " + verificationToken.getExpiryTime() +
                    "\nCurrent: " + LocalDateTime.now() +
                    "\nUsed: " + verificationToken.isUsed() +
                    "\nUser Verified: " + user.isVerified() +
                    "\nExpired: " + verificationToken.getExpiryTime().isBefore(LocalDateTime.now());

            return ResponseStructure.<String>builder()
                    .statusCode(HttpStatus.OK.value())
                    .message("Token debug information")
                    .data(status)
                    .build();
        } catch (Exception e) {
            return ResponseStructure.<String>builder()
                    .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Error debugging token: " + e.getMessage())
                    .data("Token: " + token + " - ERROR: " + e.getMessage())
                    .build();
        }
    }

    /* ================= EMAIL VERIFY ================= */

    @Transactional
    public ResponseStructure<String> verifyUser(String token) {

        System.out.println("=== EMAIL VERIFICATION START ===");
        System.out.println("Token received: " + token);

        EmailVerificationToken verificationToken =
                tokenDao.findByToken(token)
                        .orElseThrow(() -> new RuntimeException("Invalid or expired token"));

        System.out.println("Token found in database");
        System.out.println("Token expiry: " + verificationToken.getExpiryTime());
        System.out.println("Current time: " + LocalDateTime.now());
        System.out.println("Token used: " + verificationToken.isUsed());

        if (verificationToken.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        // Check if token is already used
        if (verificationToken.isUsed()) {
            User user = verificationToken.getUser();
            System.out.println("Token already used. User verified status: " + user.isVerified());
            if (user.isVerified()) {
                return ResponseStructure.<String>builder()
                        .statusCode(HttpStatus.OK.value())
                        .message("Email already verified")
                        .data("You can login now")
                        .build();
            } else {
                throw new RuntimeException("Token already used but verification failed. Please register again.");
            }
        }

        User user = verificationToken.getUser();
        System.out.println("User found: " + user.getEmail());
        System.out.println("User ID: " + user.getUserId());
        System.out.println("User verified status before update: " + user.isVerified());
        
        // Check if user is already verified
        if (user.isVerified()) {
            System.out.println("User is already verified");
            return ResponseStructure.<String>builder()
                    .statusCode(HttpStatus.OK.value())
                    .message("Email already verified")
                    .data("You can login now")
                    .build();
        }
        
        System.out.println("Updating user verification status...");
        user.setVerified(true);
        user.setLoginStatus(LoginStatus.LOGGED_OUT);
        
        System.out.println("User verified status after set: " + user.isVerified());
        
        // Save the updated user
        User savedUser = userDao.updateUser(user);
        System.out.println("User saved. Verified status: " + savedUser.isVerified());
        
        // Force a direct database update to ensure verification is saved
        userRepository.updateVerificationStatus(user.getUserId(), true, LoginStatus.LOGGED_OUT);
        System.out.println("Forced direct database update completed");
        
        // Verify the update by fetching user again
        User verifiedUser = userDao.findUserById(user.getUserId()).orElse(null);
        if (verifiedUser != null) {
            System.out.println("Verification check - User verified status: " + verifiedUser.isVerified());
        }
        
        // Mark token as used instead of deleting
        verificationToken.setUsed(true);
        tokenDao.saveToken(verificationToken);
        System.out.println("Token marked as used");

        System.out.println("=== EMAIL VERIFICATION COMPLETE ===");

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Email verified successfully")
                .data("You can login now")
                .build();
    }

    /* ================= LOGIN ================= */

    @Transactional
    public ResponseStructure<Integer> login(String email, String password) {

        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        // Check if user is verified
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        if (!user.getPassword().trim().equals(password.trim())) {
            throw new RuntimeException("Invalid credentials");
        }

        otpDao.deleteAll(user.getUserId());

        String otp = OtpGenerator.generateOtp();

        OtpVerification otpVerification = OtpVerification.builder()
                .otp(otp)
                .generatedAt(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(2))
                .user(user)
                .build();

        otpDao.saveOtp(otpVerification);

        user.setLoginStatus(LoginStatus.OTP_PENDING);
        userDao.updateUser(user);

        EmailConfiguration mail = EmailConfiguration.builder()
                .to(user.getEmail())
                .subject("Login OTP")
                .body("Your OTP is: " + otp)
                .build();

        emailService.sendMail(mail);

        return ResponseStructure.<Integer>builder()
                .statusCode(HttpStatus.OK.value())
                .message("OTP sent to registered email")
                .data(user.getUserId())
                .build();
    }

    /* ================= LOGOUT ================= */

    @Transactional
    public ResponseStructure<String> logout(int userId) {
        User user = userDao.findUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setLoginStatus(LoginStatus.LOGGED_OUT);
        userDao.updateUser(user);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Logged out successfully")
                .data("SUCCESS")
                .build();
    }

    public ResponseStructure<Boolean> checkVerificationStatus(String email) {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseStructure.<Boolean>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Verification status")
                .data(user.isVerified())
                .build();
    }

    public ResponseStructure<String> debugUser(String email) {
        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String debugInfo = "User ID: " + user.getUserId() + 
                          "\nEmail: " + user.getEmail() + 
                          "\nName: " + user.getName() + 
                          "\nVerified: " + user.isVerified() + 
                          "\nLogin Status: " + user.getLoginStatus() +
                          "\nCreated At: " + user.getCreatedAt();
        
        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("User debug info")
                .data(debugInfo)
                .build();
    }

    public ResponseStructure<String> testConfig() {
        String configInfo = "Frontend URL from AppConfig: " + appConfig.getFrontendUrl();
        
        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Configuration test")
                .data(configInfo)
                .build();
    }

    /* ================= OTP VERIFY ================= */

    @Transactional
    public ResponseStructure<String> verifyOtp(String email, String otp) {

        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is verified
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        OtpVerification otpEntity = otpDao.getLatestOtp(user.getUserId());

        if (otpEntity.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        if (!otpEntity.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setLoginStatus(LoginStatus.LOGGED_IN);
        userDao.updateUser(user);

        otpDao.deleteAll(user.getUserId());

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Login successful")
                .data("LOGIN_SUCCESS")
                .build();
    }

    /* ================= RESEND OTP ================= */

    public ResponseStructure<String> resendOtp(String email) {

        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is verified
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        OtpVerification lastOtp = otpDao.getLatestOtp(user.getUserId());

        long secondsPassed =
                Duration.between(lastOtp.getGeneratedAt(), LocalDateTime.now()).getSeconds();

        if (secondsPassed < 60) {
            throw new RuntimeException(
                    "Please wait " + (60 - secondsPassed) + " seconds before resending OTP");
        }

        String newOtp = OtpGenerator.generateOtp();

        OtpVerification otp = OtpVerification.builder()
                .otp(newOtp)
                .generatedAt(LocalDateTime.now())
                .expiryTime(LocalDateTime.now().plusMinutes(2))
                .user(user)
                .build();

        otpDao.saveOtp(otp);

        EmailConfiguration mail = EmailConfiguration.builder()
                .to(user.getEmail())
                .subject("Login OTP")
                .body("Your OTP is: " + newOtp)
                .build();

        emailService.sendMail(mail);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("OTP resent successfully")
                .data("OTP_RESENT")
                .build();
    }

    /* ================= PROFILE ================= */

    public ResponseStructure<String> updateProfile(String email, String name) {

        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is verified
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        user.setName(name);
        userDao.updateUser(user);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Profile updated")
                .data("SUCCESS")
                .build();
    }

    public ResponseStructure<String> changePassword(
            String email, String oldPwd, String newPwd) {

        User user = userDao.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is verified
        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email first");
        }

        if (!user.getPassword().equals(oldPwd)) {
            throw new RuntimeException("Old password incorrect");
        }

        user.setPassword(newPwd);
        userDao.updateUser(user);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Password changed")
                .data("SUCCESS")
                .build();
    }

    /* ================= SOCIAL LOGIN ================= */

    public ResponseStructure<Integer> socialLogin(SocialLoginRequest request) {
        User user = null;
        
        if ("google".equals(request.getProvider())) {
            user = userDao.findByGoogleId(request.getSocialId()).orElse(null);
        } else if ("facebook".equals(request.getProvider())) {
            user = userDao.findByFacebookId(request.getSocialId()).orElse(null);
        }

        if (user == null) {
            user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .verified(true)
                    .loginStatus(LoginStatus.LOGGED_IN)
                    .profileImageUrl(request.getProfileImageUrl())
                    .createdAt(LocalDateTime.now())
                    .build();

            if ("google".equals(request.getProvider())) {
                user.setGoogleId(request.getSocialId());
            } else if ("facebook".equals(request.getProvider())) {
                user.setFacebookId(request.getSocialId());
            }

            user = userDao.saveUser(user);
        } else {
            user.setLoginStatus(LoginStatus.LOGGED_IN);
            if (request.getProfileImageUrl() != null) {
                user.setProfileImageUrl(request.getProfileImageUrl());
            }
            userDao.updateUser(user);
        }

        return ResponseStructure.<Integer>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Social login successful")
                .data(user.getUserId())
                .build();
    }

    public ResponseStructure<String> linkSocialAccount(int userId, SocialLoginRequest request) {
        User user = userDao.findUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("google".equals(request.getProvider())) {
            if (user.getGoogleId() != null) {
                throw new RuntimeException("Google account already linked");
            }
            user.setGoogleId(request.getSocialId());
        } else if ("facebook".equals(request.getProvider())) {
            if (user.getFacebookId() != null) {
                throw new RuntimeException("Facebook account already linked");
            }
            user.setFacebookId(request.getSocialId());
        }

        userDao.updateUser(user);

        return ResponseStructure.<String>builder()
                .statusCode(HttpStatus.OK.value())
                .message("Social account linked successfully")
                .data("SUCCESS")
                .build();
    }
}
