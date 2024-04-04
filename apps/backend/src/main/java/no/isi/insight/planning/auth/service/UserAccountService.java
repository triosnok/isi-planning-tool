package no.isi.insight.planning.auth.service;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import no.isi.insight.planning.error.model.NotFoundException;
import no.isi.insight.planning.model.UserAccount;
import no.isi.insight.planning.model.UserAccountRole;
import no.isi.insight.planning.repository.UserAccountJpaRepository;

@Service
@RequiredArgsConstructor
public class UserAccountService {
  private final UserAccountJpaRepository jpaRepository;
  private final PasswordEncoder passwordEncoder;

  /**
   * 
   * @param fullName
   * @param email
   * @param phone
   * @param password
   * @param role
   * 
   * @return
   */
  public UserAccount createAccount(
      String fullName,
      String email,
      String phone,
      String password,
      UserAccountRole role
  ) {
    var encodedPassword = this.passwordEncoder.encode(password);

    var userAccount = new UserAccount(
      fullName,
      email,
      phone,
      encodedPassword,
      role
    );

    return this.jpaRepository.save(userAccount);
  }

  /**
   * 
   * @param id
   * @param fullName
   * @param email
   * @param phone
   * @param password
   * @param role
   * 
   * @return
   */
  public UserAccount updateAccount(
      UUID id,
      String fullName,
      String email,
      String phone,
      String password,
      UserAccountRole role
  ) {

    UserAccount userAccount = this.jpaRepository.findById(id)
      .orElseThrow(() -> new NotFoundException("User account with id " + id + " not found."));

    userAccount.setFullName(fullName);
    userAccount.setEmail(email);
    userAccount.setPhoneNumber(phone);

    var encodedPassword = this.passwordEncoder.encode(password);
    userAccount.setPassword(encodedPassword);

    userAccount.setRole(role);

    return this.jpaRepository.save(userAccount);
  }

  /**
   * 
   * @param userAccount
   */
  public void deleteAccount(
      UserAccount userAccount
  ) {
    this.jpaRepository.delete(userAccount);
  }

}
