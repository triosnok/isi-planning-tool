package no.isi.insight.planning.model;

/**
 * A user account role in the database.
 */
public enum UserAccountRole {

  PLANNER(Code.Planner),
  DRIVER(Code.Driver);

  private final String code;

  UserAccountRole(
      String code
  ) {
    this.code = code;
  }

  /**
   * Get the code of the user account role.
   *
   * @return the code of the user account role
   */
  public String getCode() {
    return this.code;
  }

  /**
   * Get the user account role from the code.
   *
   * @param code the code of the user account role
   * @return the user account role
   */
  public static class Code {
    public static final String Planner = "PLANNER";
    public static final String Driver = "DRIVER";

    private Code() {}
  }
}
