package no.isi.insight.planning.client.useraccount;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.service.annotation.GetExchange;
import org.springframework.web.service.annotation.HttpExchange;
import org.springframework.web.service.annotation.PostExchange;

import io.swagger.v3.oas.annotations.tags.Tag;
import no.isi.insight.planning.client.useraccount.view.CreateUserAccountRequest;
import no.isi.insight.planning.client.useraccount.view.UserAccountDetails;

@Tag(name = "User Accounts")
@HttpExchange("/api/v1/user-accounts")
public interface UserAccountRestService {

  @GetExchange
  ResponseEntity<List<UserAccountDetails>> findAllUserAccounts();

  @PostExchange
  ResponseEntity<UserAccountDetails> createUserAccount(
      @Validated @RequestBody CreateUserAccountRequest request
  );
}
