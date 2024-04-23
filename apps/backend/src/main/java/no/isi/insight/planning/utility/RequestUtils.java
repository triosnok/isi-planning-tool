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
    var authentication = SecurityContextHolder.getContext().getAuthentication();

    if (authentication == null) {
      return Optional.empty();
    }

    return switch (authentication.getPrincipal()) {
      case UserAccountDetailsAdapter uda -> Optional.of(uda.getUserAccount());
      default -> Optional.empty();
    };
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
