package no.isi.insight.planning.client.search.view;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import lombok.Data;
import lombok.EqualsAndHashCode;
import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@Data
@GenerateTypeScript
@JsonTypeInfo(
  use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type", visible = true
)
@JsonSubTypes({
    @JsonSubTypes.Type(value = SearchResult.ProjectResult.class, name = "PROJECT"),
    @JsonSubTypes.Type(value = SearchResult.UserResult.class, name = "USER"),
    @JsonSubTypes.Type(value = SearchResult.VehicleResult.class, name = "VEHICLE")
})
public abstract class SearchResult {
  private ResultType type;

  public static enum ResultType {
    PROJECT,
    USER,
    VEHICLE
  }

  @Data
  @EqualsAndHashCode(callSuper = false)
  public static class ProjectResult extends SearchResult {
    private UUID id;
    private String name;
    private String referenceCode;
  }

  @Data
  @EqualsAndHashCode(callSuper = false)
  public static class UserResult extends SearchResult {
    private UUID id;
    private String fullName;
  }

  @Data
  @EqualsAndHashCode(callSuper = false)
  public static class VehicleResult extends SearchResult {
    private UUID id;
    private String model;
    private String registrationNumber;
  }

}
