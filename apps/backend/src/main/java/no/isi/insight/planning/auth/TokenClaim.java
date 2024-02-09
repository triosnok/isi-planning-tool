package no.isi.insight.planning.auth;

public enum TokenClaim {
  EMAIL("username"),
  ROLE("role"),
  FULL_NAME("fullName");

  public final String name;

  TokenClaim(
      String name
  ) {
    this.name = name;
  }

}
