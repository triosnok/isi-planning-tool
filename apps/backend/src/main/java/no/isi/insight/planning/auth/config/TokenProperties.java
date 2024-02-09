package no.isi.insight.planning.auth.config;

/**
 * Configuration properties for a JWT token.
 */
public record TokenProperties(long expirationMs, String secret) {}
