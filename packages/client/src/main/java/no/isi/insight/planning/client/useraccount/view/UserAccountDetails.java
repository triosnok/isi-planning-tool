package no.isi.insight.planning.client.useraccount.view;

import java.util.UUID;

import lombok.Builder;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;
import no.isi.insight.planning.client.auth.view.UserRole;

@Builder
@GenerateTypeScript
public record UserAccountDetails(UUID id, String fullName, String email, String phoneNumber, UserRole role) {}
