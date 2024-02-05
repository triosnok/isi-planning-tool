package no.isi.insight.planner.client.auth.view;

import no.isi.insight.planner.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public record SignInRequest(String email, String password) {}
