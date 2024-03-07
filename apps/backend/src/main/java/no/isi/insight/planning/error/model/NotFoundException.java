package no.isi.insight.planning.error.model;

import org.springframework.http.HttpStatus;

public class NotFoundException extends StatusCodeException {

  public NotFoundException(
      String message
  ) {
    super(HttpStatus.NOT_FOUND, message);
  }

  public NotFoundException(
      String message,
      Throwable cause
  ) {
    super(HttpStatus.NOT_FOUND, message, cause);
  }

}
