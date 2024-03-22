package no.insight.simulator;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("no.isi.insight.simulator.planning-client")
public record PlanningClientProperties(String baseUrl, String username, String password) {}
