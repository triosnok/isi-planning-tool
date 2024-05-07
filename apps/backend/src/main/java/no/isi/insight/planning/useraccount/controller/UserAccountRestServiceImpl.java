package no.isi.insight.planning.useraccount.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.auth.annotation.PlannerAuthorization;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.useraccount.UserAccountRestService;
import no.isi.insight.planning.client.useraccount.view.CreateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UpdateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UserAccountDetails;
import no.isi.insight.planning.db.model.UserAccountRole;
import no.isi.insight.planning.db.repository.TripJdbcRepository;
import no.isi.insight.planning.db.repository.UserAccountJdbcRepository;
import no.isi.insight.planning.db.repository.UserAccountJpaRepository;
import no.isi.insight.planning.error.model.ForbiddenException;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.error.model.UnauthorizedException;
import no.isi.insight.planning.utility.RequestUtils;

@RestController
@RequiredArgsConstructor
public class UserAccountRestServiceImpl implements UserAccountRestService {

  private final UserAccountJpaRepository userAccountJpaRepository;
  private final UserAccountService userService;
  private final TripJdbcRepository tripJdbcRepository;
  private final UserAccountJdbcRepository userAccountJdbcRepository;

  @Override
  @PlannerAuthorization
  public ResponseEntity<List<UserAccountDetails>> findAllUserAccounts() {
    var users = this.userAccountJdbcRepository.findAll();
    return ResponseEntity.ok(users);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<UserAccountDetails> findUserAccountById(
      UUID id
  ) {
    var userAccount = this.userAccountJdbcRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Could not find user with id: %s".formatted(id.toString())));

    return ResponseEntity.ok(userAccount);
  }

  @Override
  @PlannerAuthorization
  public ResponseEntity<UserAccountDetails> createUserAccount(
      CreateUserAccountRequest request
  ) {

    UserAccountRole role = switch (request.role()) {
      case PLANNER -> UserAccountRole.PLANNER;
      case DRIVER -> UserAccountRole.DRIVER;
    };

    var userAccount = this.userService
      .createAccount(request.fullName(), request.email(), request.phoneNumber(), request.password(), role);

    var details = this.userAccountJdbcRepository.findById(userAccount.getUserAccountId()).get();

    return ResponseEntity.ok(details);
  }

  @Override
  public ResponseEntity<UserAccountDetails> updateUserAccount(
      UpdateUserAccountRequest request,
      UUID id
  ) {
    var account = RequestUtils.getRequestingUserAccount()
      .orElseThrow(() -> new UnauthorizedException("Not authorized"));

    // only planners are allowed to update other users
    var permitted = switch (account.getRole()) {
      case PLANNER -> true;
      case DRIVER -> account.getUserAccountId().equals(id);
    };

    if (!permitted) {
      throw new ForbiddenException("Not authorized to update user with id: %s".formatted(id));
    }

    UserAccountRole role = switch (request.role()) {
      case PLANNER -> UserAccountRole.PLANNER;
      case DRIVER -> UserAccountRole.DRIVER;
    };

    this.userService.updateAccount(
      id,
      request.fullName(),
      request.email(),
      request.phoneNumber(),
      request.password(),
      request.changePassword(),
      role
    );

    var details = this.userAccountJdbcRepository.findById(id).get();

    return ResponseEntity.ok(details);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<TripDetails>> findTripsByUserId(
      UUID id,
      Optional<Boolean> active
  ) {
    this.userAccountJpaRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Could not find user with id: %s".formatted(id.toString())));

    return ResponseEntity.ok(this.tripJdbcRepository.findAll(id, active));
  }
}
