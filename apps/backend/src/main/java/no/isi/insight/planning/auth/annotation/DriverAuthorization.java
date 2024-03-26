package no.isi.insight.planning.auth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.security.access.prepost.PreAuthorize;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import no.isi.insight.planning.swagger.config.SwaggerConfig;

@Inherited
@Target({
    ElementType.METHOD, ElementType.TYPE
})
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasAnyAuthority('PLANNER', 'DRIVER')")
@SecurityRequirement(name = SwaggerConfig.SECURITY_SCHEME)
public @interface DriverAuthorization {}
