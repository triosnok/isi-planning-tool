package no.isi.insight.planning.useraccount.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.isi.insight.planning.auth.annotation.PlannerAuthorization;
import no.isi.insight.planning.auth.service.UserAccountService;
import no.isi.insight.planning.client.auth.view.UserRole;
import no.isi.insight.planning.client.useraccount.UserAccountRestService;
import no.isi.insight.planning.client.useraccount.view.CreateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UserAccountDetails;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.model.UserAccountRole;
import no.isi.insight.planning.repository.UserAccountJpaRepository;

@Slf4j
@RestController
@RequiredArgsConstructor
public class UserAccountRestServiceImpl implements UserAccountRestService {

  private final UserAccountJpaRepository userAccountJpaRepository;
  private final UserAccountService userService;

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
  @PlannerAuthorization
  public ResponseEntity<UserAccountDetails> createUserAccount(
      CreateUserAccountRequest request
  ) {

    if (!request.passwordMatchesConfirmation()) {
      throw new IllegalArgumentException("Password and password confirmation do not match.");
    }

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

}
