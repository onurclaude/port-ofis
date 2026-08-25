package com.portofis.backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

/**
 * Issues and validates the admin JWT (HS256), per docs/ARCHITECTURE.md §6.
 *
 * The signing key comes from ADMIN_JWT_SECRET (application property admin.jwt.secret).
 * That env var is an arbitrary operator-chosen string with no guaranteed minimum length,
 * but HS256 requires a >= 256-bit key. Rather than fail startup on a short secret, we
 * derive the actual signing key by SHA-256-hashing the configured secret, which always
 * yields a 256-bit key regardless of the raw string's length. This is a judgment call
 * not spelled out in the contract.
 */
@Component
public class JwtService {

    private final SecretKey key;
    private final long expirationHours;

    public JwtService(@Value("${admin.jwt.secret}") String secret,
                       @Value("${admin.jwt.expiration-hours:12}") long expirationHours) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("ADMIN_JWT_SECRET must be set.");
        }
        this.key = Keys.hmacShaKeyFor(sha256(secret));
        this.expirationHours = expirationHours;
    }

    public TokenResult generateToken(String username) {
        Instant now = Instant.now();
        Instant expiry = now.plus(expirationHours, ChronoUnit.HOURS);
        String token = Jwts.builder()
                .subject(username)
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .signWith(key)
                .compact();
        return new TokenResult(token, expiry);
    }

    /**
     * Returns the token's subject (username) if the token is structurally valid,
     * correctly signed and not expired; otherwise null.
     */
    public String extractUsername(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();
            return claims.getSubject();
        } catch (JwtException | IllegalArgumentException ex) {
            return null;
        }
    }

    private static byte[] sha256(String input) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(input.getBytes(StandardCharsets.UTF_8));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }

    public record TokenResult(String token, Instant expiresAt) {
    }
}
