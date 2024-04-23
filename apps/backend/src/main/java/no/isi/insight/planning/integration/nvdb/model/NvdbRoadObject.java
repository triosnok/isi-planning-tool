package no.isi.insight.planning.integration.nvdb.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import no.isi.insight.planning.db.model.RoadDirection;
import no.isi.insight.planning.db.model.RoadSide;

public record NvdbRoadObject(
  long id,
  @JsonAlias("geometri") Geometry geometry,
  @JsonAlias("vegsegmenter") List<RoadSegment> roadSegments,
  @JsonAlias("lokasjon") Location location
) {

  public static record Geometry(String wkt, int srid, @JsonAlias("egengeometri") boolean isOwnGeomtry) {}

  public static record RoadSegment(
    @JsonAlias("veglenkesekvensid") Long sequenceId,
    @JsonAlias("startposisjon") Double startPosition,
    @JsonAlias("sluttposisjon") Double endPosition,
    @JsonAlias("lengde") Double length,
    @JsonAlias("retning") Direction direction,
    @JsonAlias("geometri") Geometry geometry,
    @JsonAlias("vegsystemreferanse") RoadSystemReference roadSystemReference
  ) {

    public String getShortform() {
      return "%.8f-%.8f@%s".formatted(this.startPosition, this.endPosition, this.sequenceId);
    }

    public boolean isWithin(
        Placement placement
    ) {
      return this.sequenceId.equals(placement.sequenceId()) && this.startPosition >= placement.startPosition()
          && this.endPosition <= placement.endPosition();
    }

  }

  public static record Location(
    @JsonAlias("geometri") Geometry geometry,
    @JsonAlias("vegsystemreferanser") List<RoadSystemReference> roadSystemReferences,
    @JsonAlias("stedfestinger") List<Placement> placements,
    @JsonAlias("lengde") Double length
  ) {}

  public static record RoadSystemReference(
    @JsonAlias("vegsystem") RoadSystem system,
    @JsonAlias("kortform") String shortform,
    @JsonAlias("strekning") RoadStretch stretch
  ) {}

  public static record RoadStretch(@JsonAlias("retning") Direction direction) {}

  public static record Placement(
    @JsonAlias("veglenkesekvensid") Long sequenceId,
    @JsonAlias("startposisjon") Double startPosition,
    @JsonAlias("sluttposisjon") Double endPosition,
    @JsonAlias("retning") Direction direction,
    @JsonAlias("sideposisjon") Side side,
    @JsonAlias("kortform") String shortform
  ) {}

  public static record RoadSystem(
    Long id,
    @JsonAlias("vegkategori") String category,
    @JsonAlias("fase") String phase,
    @JsonAlias("nummer") Integer number
  ) {}

  public static enum Direction {
    MED,
    MOT;

    public RoadDirection toRoadDirection() {
      return switch (this) {
        case MED -> RoadDirection.WITH;
        case MOT -> RoadDirection.AGAINST;
      };
    }
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
    L;

    public RoadSide toRoadSide() {
      return switch (this) {
        case H -> RoadSide.RIGHT;
        case V -> RoadSide.LEFT;
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

}
