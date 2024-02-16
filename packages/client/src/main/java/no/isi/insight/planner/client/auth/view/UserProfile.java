package no.isi.insight.planner.client.auth.view;

import lombok.Builder;
import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@Builder
@GenerateTypeScript
public record UserProfile(String fullName, String email, String phoneNumber, UserRole role) {}
