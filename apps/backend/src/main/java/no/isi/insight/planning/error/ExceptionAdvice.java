package no.isi.insight.planning.error;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.client.error.view.ValidationErrorDescription;
import no.isi.insight.planning.error.model.StatusCodeException;
import no.isi.insight.planning.utility.RequestUtils;

@Slf4j
@RestControllerAdvice
public class ExceptionAdvice {

  @ExceptionHandler(StatusCodeException.class)
  public ProblemDetail handle(
      StatusCodeException e
  ) {
    var pd = ProblemDetail.forStatusAndDetail(e.getStatusCode(), e.getMessage());
    return pd;
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ProblemDetail handle(
      MethodArgumentNotValidException e
  ) {
    var errors = new HashMap<String, List<ValidationErrorDescription>>();
    var count = 0;

    for (var error : e.getFieldErrors()) {
      var mappedError = ValidationErrorDescription.builder().message(error.getDefaultMessage()).build();
      errors.computeIfAbsent(error.getField(), (k) -> new ArrayList<ValidationErrorDescription>()).add(mappedError);
      count++;
    }

    var pd = ProblemDetail
      .forStatusAndDetail(HttpStatus.BAD_REQUEST, "Request contains %d validation error(s)".formatted(count));

    pd.setProperty("errors", Map.of("fields", errors.keySet(), "reasons", errors));

    return pd;
  }

  @ExceptionHandler(DataIntegrityViolationException.class)
  public ProblemDetail handle(
      DataIntegrityViolationException e
  ) {
    log.error("Unhandled data integrity violation: {}", e.getMessage(), e);
    var pd = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error");
    return pd;
  }

  @ExceptionHandler(AccessDeniedException.class)
  public ProblemDetail handle(
      AccessDeniedException e
  ) {
    var authenticated = RequestUtils.getRequestingUserAccount().isPresent();
    var status = authenticated ? HttpStatus.FORBIDDEN : HttpStatus.UNAUTHORIZED;
    return ProblemDetail.forStatusAndDetail(status, "Access Denied");
  }

}
