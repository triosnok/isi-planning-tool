package no.isi.insight.planning.client.useraccount;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;
import org.springframework.web.service.annotation.PutExchange;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.trip.view.TripDetails;
import no.isi.insight.planning.client.useraccount.view.CreateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UpdateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UserAccountDetails;

@Tag(name = "User Accounts")
@HttpExchange("/api/v1/user-accounts")
public interface UserAccountRestService {

  @Operation(summary = "Lists all user accounts")
  @GetExchange
  ResponseEntity<List<UserAccountDetails>> findAllUserAccounts();

  @Operation(summary = "Finds a user account by its id")
  @GetExchange("/{id}")
  ResponseEntity<UserAccountDetails> findUserAccountById(
      @PathVariable UUID id
  );

  @Operation(summary = "Creates a new user account")
  @PostExchange
  ResponseEntity<UserAccountDetails> createUserAccount(
      @Validated @RequestBody CreateUserAccountRequest request
  );

  @Operation(summary = "Updates a user account")
  @PutExchange("/{id}")
  ResponseEntity<UserAccountDetails> updateUserAccount(
      @Validated @RequestBody UpdateUserAccountRequest request,
      @PathVariable UUID id
  );

  @Operation(summary = "Lists all trips a user has created")
  @GetExchange("/{id}/trips")
  ResponseEntity<List<TripDetails>> findTripsByUserId(
      @PathVariable UUID id,
      @RequestParam Optional<Boolean> active
  );
}
