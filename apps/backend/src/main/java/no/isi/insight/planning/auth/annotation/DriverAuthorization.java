package no.isi.insight.planning.auth.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.security.access.prepost.PreAuthorize;

@Inherited
@Target({
    ElementType.METHOD, ElementType.TYPE
})
@Retention(RetentionPolicy.RUNTIME)
@PreAuthorize("hasAnyAuthority('PLANNER', 'DRIVER')")
public @interface DriverAuthorization {}
