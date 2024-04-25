package no.isi.insight.planning.useraccount.controller;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.auth.annotation.DriverAuthorization;
import no.isi.insight.planning.auth.annotation.PlannerAuthorization;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.client.auth.view.UserRole;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.useraccount.UserAccountRestService;
import no.isi.insight.planning.client.useraccount.view.CreateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UpdateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UserAccountDetails;
import no.isi.insight.planning.db.model.UserAccount;
import no.isi.insight.planning.db.model.UserAccountRole;
import no.isi.insight.planning.db.repository.TripJdbcRepository;
import no.isi.insight.planning.db.repository.UserAccountJpaRepository;
import no.isi.insight.planning.error.model.NotFoundException;

@RestController
@RequiredArgsConstructor
public class UserAccountRestServiceImpl implements UserAccountRestService {

  private final UserAccountJpaRepository userAccountJpaRepository;
  private final UserAccountService userService;
  private final TripJdbcRepository tripJdbcRepository;

  @Override
  @PlannerAuthorization
  public ResponseEntity<List<UserAccountDetails>> findAllUserAccounts() {

    List<UserAccount> userAccounts = this.userAccountJpaRepository.findAll();

    List<UserAccountDetails> userAccountDetailsList = userAccounts.stream().map(account -> {
      UserRole role = switch (account.getRole()) {
        case PLANNER -> UserRole.PLANNER;
        case DRIVER -> UserRole.DRIVER;
      };

      return UserAccountDetails.builder()
        .id(account.getUserAccountId())
        .fullName(account.getFullName())
        .email(account.getEmail())
        .phoneNumber(account.getPhoneNumber())
        .role(role)
        .build();
    }).collect(Collectors.toList());

    return ResponseEntity.ok(userAccountDetailsList);
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<UserAccountDetails> findUserAccountById(
      UUID id
  ) {
    var userAccount = this.userAccountJpaRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Could not find user with id: %s".formatted(id.toString())));

    UserRole role = switch (userAccount.getRole()) {
      case PLANNER -> UserRole.PLANNER;
      case DRIVER -> UserRole.DRIVER;
    };

    return ResponseEntity.ok(
      new UserAccountDetails(
        userAccount.getUserAccountId(),
        userAccount.getFullName(),
        userAccount.getEmail(),
        userAccount.getPhoneNumber(),
        role
      )
    );
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

    UserRole userRole = switch (userAccount.getRole()) {
      case PLANNER -> UserRole.PLANNER;
      case DRIVER -> UserRole.DRIVER;
    };

    return ResponseEntity.ok(
      new UserAccountDetails(
        userAccount.getUserAccountId(),
        userAccount.getFullName(),
        userAccount.getEmail(),
        userAccount.getPhoneNumber(),
        userRole
      )
    );
  }

  @Override
  @PlannerAuthorization
  public ResponseEntity<UserAccountDetails> updateUserAccount(
      UpdateUserAccountRequest request,
      UUID id
  ) {

    UserAccountRole role = switch (request.role()) {
      case PLANNER -> UserAccountRole.PLANNER;
      case DRIVER -> UserAccountRole.DRIVER;
    };

    var updatedUserAccount = this.userService.updateAccount(
      id,
      request.fullName(),
      request.email(),
      request.phoneNumber(),
      request.password(),
      request.changePassword(),
      role
    );

    UserRole userRole = switch (updatedUserAccount.getRole()) {
      case PLANNER -> UserRole.PLANNER;
      case DRIVER -> UserRole.DRIVER;
    };

    return ResponseEntity.ok(
      new UserAccountDetails(
        updatedUserAccount.getUserAccountId(),
        updatedUserAccount.getFullName(),
        updatedUserAccount.getEmail(),
        updatedUserAccount.getPhoneNumber(),
        userRole
      )
    );
  }

  @Override
  @DriverAuthorization
  public ResponseEntity<List<TripDetails>> findTripsByUserId(
      UUID id,
      Optional<Boolean> active
  ) {
    this.userAccountJpaRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("Could not find user with id: %s".formatted(id.toString())));

    return ResponseEntity.ok(this.tripJdbcRepository.findAllByDriverId(id, active));
  }
}
