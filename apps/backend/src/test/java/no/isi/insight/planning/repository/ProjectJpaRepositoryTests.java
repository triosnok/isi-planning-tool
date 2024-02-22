package no.isi.insight.planning.repository;

import static org.junit.Assert.assertEquals;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.annotation.IntegrationTest;
import no.isi.insight.planning.model.Project;

@IntegrationTest
@RequiredArgsConstructor
class ProjectJpaRepositoryTests {

  private final ProjectJpaRepository projectJpaRepository;

  @Test
  void canSaveAndFindProject() {
    var newProject = new Project(
      "Project 1",
      "REF523592",
      LocalDate.now(),
      LocalDate.now().plusDays(30)
    );

    var savedProject = projectJpaRepository.save(newProject);

    assertEquals(newProject, savedProject);
    assertEquals(newProject.getId(), savedProject.getId());
    assertEquals(newProject.getName(), savedProject.getName());

    var foundProject = projectJpaRepository.findById(savedProject.getId());

    assertEquals(savedProject.getId(), foundProject.getId());
    assertEquals(savedProject.getName(), foundProject.getName());
    assertEquals(savedProject.getReferenceCode(), foundProject.getReferenceCode());
  }
}
