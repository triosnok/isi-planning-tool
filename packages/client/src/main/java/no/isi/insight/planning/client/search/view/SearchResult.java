package no.isi.insight.planning.client.search.view;

import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

import no.isi.insight.planning.client.annotation.GenerateTypeScript;

@GenerateTypeScript
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes({
    @JsonSubTypes.Type(value = SearchResult.ProjectResult.class, name = "PROJECT"),
    @JsonSubTypes.Type(value = SearchResult.UserResult.class, name = "USER"),
    @JsonSubTypes.Type(value = SearchResult.VehicleResult.class, name = "VEHICLE")
})
public record SearchResult(String type) {

  public static record ProjectResult(UUID id, String name) {}

  public static record UserResult(UUID id, String fullName) {}

  public static record VehicleResult(UUID id, String model, String registrationNumber) {}

}
