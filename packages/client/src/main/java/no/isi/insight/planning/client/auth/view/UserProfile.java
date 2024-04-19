package no.isi.insight.planning.client.auth.view;

import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record UserProfile(UUID id, String fullName, String email, String phoneNumber, UserRole role) {}
