package no.isi.insight.planning.swagger.config;

import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;

@Configuration
@SecurityScheme(
  name = SwaggerConfig.SECURITY_SCHEME, type = SecuritySchemeType.HTTP, in = SecuritySchemeIn.HEADER, scheme = "bearer",
  bearerFormat = "JWT", description = "An access token"
)
public class SwaggerConfig implements OpenApiCustomizer {

  public static final String SECURITY_SCHEME = "jwt";

  @Override
  public void customise(
      OpenAPI openApi
  ) {
    var info = new Info().title("isi-planning-tool API")
      .description("API for the isi-planning-tool application, a bachelor project at NTNU in collaboration with iSi.")
      .version("1.0.0")
      .contact(new Contact().name("GitHub").url("https://github.com/triosnok/isi-planning-tool"));

    openApi.info(info);
  }

}
