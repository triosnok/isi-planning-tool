package no.isi.insight.planning.client.auth.view;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
public enum UserRole {
  DRIVER,
  PLANNER;

  public static UserRole fromString(
      String string
  ) {
    for (var role : UserRole.values()) {
      if (role.name().equalsIgnoreCase(string)) {
        return role;
      }
    }

    throw new IllegalArgumentException("Could not find user role for string: %s".formatted(string));
  }

}
