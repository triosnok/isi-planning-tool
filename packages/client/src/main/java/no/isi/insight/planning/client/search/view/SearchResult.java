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
    @JsonSubTypes.Type(value = SearchResult.VehicleResult.class, name = "VEHICLE"),
    @JsonSubTypes.Type(value = SearchResult.RailingResult.class, name = "RAILING"),
    @JsonSubTypes.Type(value = SearchResult.RoadSegmentResult.class, name = "ROAD_SEGMENT")
})
public abstract class SearchResult {
  private ResultType type;

  public static enum ResultType {
    PROJECT,
    USER,
    VEHICLE,
    RAILING,
    ROAD_SEGMENT
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
    private String email;
  }

  @Data
  @EqualsAndHashCode(callSuper = false)
  public static class VehicleResult extends SearchResult {
    private UUID id;
    private String model;
    private String registrationNumber;
  }

  @Data
  @EqualsAndHashCode(callSuper = false)
  public static class RailingResult extends SearchResult {
    private Long id;
    private UUID projectId;
    private String projectName;
    private String projectReferenceCode;
  }

  @Data
  @EqualsAndHashCode(callSuper = false)
  public static class RoadSegmentResult extends SearchResult {
    private String id;
    private Long railingId;
    private String roadSystemReference;
    private UUID projectId;
    private String projectName;
    private String projectReferenceCode;
  }

}
