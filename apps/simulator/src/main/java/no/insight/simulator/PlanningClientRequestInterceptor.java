package no.insight.simulator;

import java.io.IOException;

import org.springframework.http.HttpRequest;
import org.springframework.http.client.ClientHttpRequestExecution;
import org.springframework.http.client.ClientHttpRequestInterceptor;
import org.springframework.http.client.ClientHttpResponse;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PlanningClientRequestInterceptor implements ClientHttpRequestInterceptor {
  private final PlanningClientAuthentication authentication;

  @Override
  public ClientHttpResponse intercept(
      HttpRequest request,
      byte[] body,
      ClientHttpRequestExecution execution
  ) throws IOException {
    request.getHeaders().set("Authorization", "Bearer %s".formatted(this.authentication.getAccessToken()));
    request.getHeaders().set("Cookie", "refresh-token=%s".formatted(this.authentication.getRefreshToken()));
    return execution.execute(request, body);
  }

}
