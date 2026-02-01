package com.example.eventmanagement.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.example.eventmanagement.model.User;
import com.example.eventmanagement.util.LoginStatus;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select u from User u where u.email = ?1")
    Optional<User> findByEmail(String email);

    @Query("select u from User u where u.email = ?1 and u.verified = true")
    Optional<User> findVerifiedUserByEmail(String email);

    @Query("select u from User u where u.userId = ?1 and u.verified = true")
    Optional<User> findVerifiedUserById(int userId);

    @Query("select count(u) from User u where u.verified = true")
    long countVerifiedUsers();

    Optional<User> findByGoogleId(String googleId);

    Optional<User> findByFacebookId(String facebookId);

    @Query("select u from User u where u.googleId = ?1 or u.facebookId = ?1")
    Optional<User> findBySocialId(String socialId);

    boolean existsByEmail(String email);

    boolean existsByGoogleId(String googleId);

    boolean existsByFacebookId(String facebookId);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.verified = ?2, u.loginStatus = ?3 WHERE u.userId = ?1")
    void updateVerificationStatus(int userId, boolean verified, LoginStatus loginStatus);
}
