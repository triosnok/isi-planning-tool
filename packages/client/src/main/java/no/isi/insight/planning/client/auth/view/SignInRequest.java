package no.isi.insight.planning.client.auth.view;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record SignInRequest(String email, String password) {}
