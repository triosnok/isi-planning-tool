package no.isi.insight.planning.db.repository;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.db.model.Project;
import no.isi.insight.planning.db.model.ProjectPlan;
import no.isi.insight.planning.db.model.Trip;
import no.isi.insight.planning.db.model.UserAccount;
import no.isi.insight.planning.db.model.UserAccountRole;
import no.isi.insight.planning.db.model.Vehicle;
import no.isi.insight.planning.error.model.NotFoundException;

@IntegrationTest
@RequiredArgsConstructor
class TripJpaRepositoryTests {
  private final TripJpaRepository tripJpaRepository;
  private final ProjectJpaRepository projectJpaRepository;
  private final ProjectPlanJpaRepository projectPlanJpaRepository;
  private final VehicleJpaRepository vehicleJpaRepository;
  private final UserAccountJpaRepository userAccountJpaRepository;

  private ProjectPlan projectPlan;
  private Vehicle vehicle;
  private UserAccount userAccount;

  @BeforeEach
  void setUp() {
    var project = new Project(
      "Test project",
      "Test project description",
      LocalDate.now(),
      LocalDate.now().plusDays(20)
    );

    projectPlan = new ProjectPlan(
      project,
      LocalDate.now(),
      LocalDate.now().plusDays(20)
    );

    vehicle = new Vehicle(
      "https://picsum.photos/300/200",
      "REF5232949",
      "model",
      true,
      "car",
      "9230-234923940-42394"
    );

    userAccount = new UserAccount(
      "Test User",
      "test.user@gmail.com",
      "57b114ab-0f6f-4dc8-9ead-3963d00b67f1",
      "12-345-678",
      "password",
      UserAccountRole.DRIVER
    );

    projectJpaRepository.save(project);
    projectPlanJpaRepository.save(projectPlan);
    vehicleJpaRepository.save(vehicle);
    userAccountJpaRepository.save(userAccount);

  }

  @Test
  void canSaveAndFindTrip() {
    var newTrip = new Trip(
      this.vehicle,
      this.userAccount,
      this.projectPlan,
      LocalDateTime.of(2023, 1, 1, 9, 0),
      1
    );

    var savedTrip = tripJpaRepository.save(newTrip);

    assertEquals(newTrip, savedTrip);
    assertEquals(newTrip.getId(), savedTrip.getId());

    var foundTrip = tripJpaRepository.findById(savedTrip.getId())
      .orElseThrow(() -> new NotFoundException("Trip not found"));

    assertEquals(savedTrip.getId(), foundTrip.getId());
    assertEquals(savedTrip.getStartedAt(), foundTrip.getStartedAt());
    assertEquals(savedTrip.getEndedAt(), foundTrip.getEndedAt());
    assertEquals(savedTrip.getGnssLog(), foundTrip.getGnssLog());
    assertEquals(savedTrip.getCameraLogs(), foundTrip.getCameraLogs());
  }

}
