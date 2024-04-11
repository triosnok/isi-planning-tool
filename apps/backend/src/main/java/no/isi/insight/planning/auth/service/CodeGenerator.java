package no.isi.insight.planning.auth.service;

import java.security.SecureRandom;

public class CodeGenerator {
  private static final int CHAR_LEFT_BOUND = 48; // '0'
  private static final SecureRandom RANDOM = new SecureRandom();
  private final int charRightBound;

  public CodeGenerator(
      CodeType type
  ) {
    this.charRightBound = switch (type) {
      case ALPHANUMERIC -> 123; // 'z' + 1
      case NUMERIC -> 58; // '9' + 1
    };
  }

  public String generateCode(
      int size
  ) {
    return RANDOM.ints(CHAR_LEFT_BOUND, this.charRightBound)
      // skip characters that are not alphanumeric
      .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
      .limit(size)
      .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
      .toString();
  }

  public static enum CodeType {
    NUMERIC,
    ALPHANUMERIC
  }

}
