package no.insight.simulator;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.client.auth.AuthRestService;
import no.isi.insight.planning.client.capture.CaptureRestService;

@Configuration
@RequiredArgsConstructor
public class PlanningClientConfiguration {
  private final PlanningClientProperties properties;

  @Bean
  HttpServiceProxyFactory httpServiceProxyFactory(
      PlanningClientRequestInterceptor interceptor
  ) {
    var rc = RestClient.builder().baseUrl(this.properties.baseUrl()).requestInterceptor(interceptor).build();
    var rca = RestClientAdapter.create(rc);
    return HttpServiceProxyFactory.builderFor(rca).build();
  }

  @Bean
  AuthRestService authRestService(
      HttpServiceProxyFactory proxyFactory
  ) {
    return proxyFactory.createClient(AuthRestService.class);
  }

  @Bean
  CaptureRestService captureRestService(
      HttpServiceProxyFactory proxyFactory
  ) {
    return proxyFactory.createClient(CaptureRestService.class);
  }

}
