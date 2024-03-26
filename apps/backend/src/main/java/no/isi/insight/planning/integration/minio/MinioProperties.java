package no.isi.insight.planning.integration.minio;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("no.isi.insight.planning.integration.minio")
public record MinioProperties(String url, String accessKey, String secretKey) {}
