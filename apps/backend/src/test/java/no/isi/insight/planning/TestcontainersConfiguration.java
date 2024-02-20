package no.isi.insight.planning;

import org.testcontainers.utility.DockerImageName;

public class TestcontainersConfiguration {
  public static final DockerImageName POSTGIS_IMAGE_NAME = DockerImageName.parse("postgis/postgis:16-3.4-alpine")
    .asCompatibleSubstituteFor("postgres");
}
