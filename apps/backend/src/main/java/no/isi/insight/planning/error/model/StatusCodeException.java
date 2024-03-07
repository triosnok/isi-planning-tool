package no.isi.insight.planning.error.model;

import org.springframework.http.HttpStatusCode;

/**
 * Exception that holds a specific status code that can be indicated to the client.
 */
public class StatusCodeException extends RuntimeException {
  private HttpStatusCode statusCode;

  public StatusCodeException(
      HttpStatusCode statusCode,
      String message,
      Throwable cause
  ) {
    super(message, cause);

    this.statusCode = statusCode;
  }

  public StatusCodeException(
      HttpStatusCode statusCode,
      String message
  ) {
    super(message);

    this.statusCode = statusCode;
  }

  public HttpStatusCode getStatusCode() {
    return this.statusCode;
  }

}
