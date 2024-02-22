package no.isi.insight.planning.integration.nvdb.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import no.isi.insight.planning.model.RoadDirection;
import no.isi.insight.planning.model.RoadSide;

public record NvdbRoadObject(
  long id,
  @JsonAlias("geometri") Geometry geometry,
  @JsonAlias("lokasjon") Location location
) {

  public static record Geometry(String wkt, int srid, @JsonAlias("egengeometri") boolean isOwnGeomtry) {}

  public static record Location(
    @JsonAlias("geometri") Geometry geometry,
    @JsonAlias("vegsystemreferanser") List<RoadSystemReference> roadSystemReferences,
    @JsonAlias("stedfestinger") List<Placement> placements,
    @JsonAlias("lengde") Double length
  ) {}

  public static record RoadSystemReference(
    @JsonAlias("vegsystem") RoadSystem system,
    @JsonAlias("kortform") String shortform
  ) {}

  public static record Placement(@JsonAlias("retning") Direction direction, @JsonAlias("sideposisjon") Side side) {

    public RoadDirection getDirection() {
      if (this.direction == null) {
        return null;
      }

      return switch (this.direction) {
        case MED -> RoadDirection.WITH;
        case MOT -> RoadDirection.AGAINST;
      };
    }

    public RoadSide getSide() {
      if (this.side == null) {
        return null;
      }

      return switch (this.side) {
        case H -> RoadSide.LEFT;
        case V -> RoadSide.RIGHT;
        case HV -> RoadSide.LEFT_AND_RIGHT;
        case M -> RoadSide.MIDDLE;
        case K -> RoadSide.CROSSING;
        case MV -> RoadSide.MIDDLE_LEFT;
        case MH -> RoadSide.MIDDLE_RIGHT;
        case VT -> RoadSide.LEFT_ACCESS;
        case HT -> RoadSide.RIGHT_ACCESS;
        case R0 -> RoadSide.ROUNDABOUT_CENTRE;
        case L -> RoadSide.LONGITUDINAL;
      };
    }

  }

  public static record RoadSystem(Long id) {}

  public static enum Direction {
    MED,
    MOT
  }

  public static enum Side {
    H,
    V,
    HV,
    M,
    K,
    MV,
    MH,
    VT,
    HT,
    R0,
    L
  }

}
