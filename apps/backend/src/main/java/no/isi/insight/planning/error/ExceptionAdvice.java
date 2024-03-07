package no.isi.insight.planning.error;

import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import no.isi.insight.planning.error.model.StatusCodeException;

@RestControllerAdvice
public class ExceptionAdvice {

  @ExceptionHandler(StatusCodeException.class)
  public ProblemDetail handle(
      StatusCodeException e
  ) {
    var pd = ProblemDetail.forStatusAndDetail(e.getStatusCode(), e.getMessage());
    return pd;
  }

}
