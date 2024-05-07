package no.isi.insight.planning.error.model;

import org.springframework.http.HttpStatus;

public class ForbiddenException extends StatusCodeException {

  public ForbiddenException(
      String message
  ) {
    super(HttpStatus.FORBIDDEN, message);
  }

  public ForbiddenException(
      String message,
      Throwable cause
  ) {
    super(HttpStatus.FORBIDDEN, message, cause);
  }

}
