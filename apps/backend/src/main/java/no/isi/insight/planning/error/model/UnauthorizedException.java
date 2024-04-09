package no.isi.insight.planning.error.model;

import org.springframework.http.HttpStatus;

public class UnauthorizedException extends StatusCodeException {

  public UnauthorizedException(
      String message
  ) {
    super(HttpStatus.UNAUTHORIZED, message);
  }

  public UnauthorizedException(
      String message,
      Throwable cause
  ) {
    super(HttpStatus.UNAUTHORIZED, message, cause);
  }

}
