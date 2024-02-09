package no.isi.insight.planning.utility;

import java.util.Optional;

import org.springframework.lang.NonNull;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.annotation.Nonnull;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import no.isi.insight.planning.auth.UserAccountDetailsAdapter;
import no.isi.insight.planning.model.UserAccount;

public class RequestUtils {

  public static Optional<UserAccount> getRequestingUserAccount() {
    var principal = (UserAccountDetailsAdapter) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (principal == null) {
      return Optional.empty();
    }

    return Optional.of(principal.getUserAccount());
  }

  @NonNull
  private static ServletRequestAttributes getServletRequestAttributes() {
    return (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
  }

  @NonNull
  public static HttpServletRequest getServletRequest() {
    return getServletRequestAttributes().getRequest();
  }

  @Nonnull
  public static HttpServletResponse getServletResponse() {
    return getServletRequestAttributes().getResponse();
  }

}
