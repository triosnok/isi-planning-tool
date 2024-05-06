package no.isi.insight.planning.error.model;

import org.springframework.http.HttpStatus;

public class InternalErrorException extends StatusCodeException {

  public InternalErrorException(
      String message
  ) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }

  public InternalErrorException(
      String message,
      Throwable cause
  ) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message, cause);
  }

}
