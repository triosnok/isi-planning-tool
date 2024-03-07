package no.isi.insight.planning.error.model;

import org.springframework.http.HttpStatus;

public class BadRequestException extends StatusCodeException {

  public BadRequestException(
      String message
  ) {
    super(HttpStatus.BAD_REQUEST, message);
  }

  public BadRequestException(
      String message,
      Throwable cause
  ) {
    super(HttpStatus.BAD_REQUEST, message, cause);
  }
}
