package no.isi.insight.planning.client.auth.view;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record UserProfile(String fullName, String email, String phoneNumber, UserRole role) {}
