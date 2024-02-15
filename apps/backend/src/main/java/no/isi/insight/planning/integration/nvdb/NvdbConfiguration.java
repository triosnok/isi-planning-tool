package no.isi.insight.planning.integration.nvdb;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.support.RestClientAdapter;
import org.springframework.web.service.invoker.HttpServiceProxyFactory;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class NvdbConfiguration {
  private final NvdbProperties properties;

  @Bean
  NvdbClient nvdbClient() {
    var rc = RestClient.builder()
      .baseUrl(this.properties.baseUrl())
      .defaultHeader("X-Client", this.properties.getClientName())
      .build();

    var rca = RestClientAdapter.create(rc);
    var factory = HttpServiceProxyFactory.builderFor(rca).build();

    return factory.createClient(NvdbClient.class);
  }

}
