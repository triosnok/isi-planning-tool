package no.isi.insight.planning.auth;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import no.isi.insight.planning.db.model.UserAccount;

public class UserAccountDetailsAdapter implements UserDetails {
  private final UserAccount userAccount;

  public UserAccountDetailsAdapter(
      UserAccount userAccount
  ) {
    this.userAccount = userAccount;
  }

  public UserAccount getUserAccount() {
    return this.userAccount;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(this.userAccount.getRole().toString()));
  }

  @Override
  public String getPassword() {
    return this.userAccount.getPassword();
  }

  @Override
  public String getUsername() {
    return this.userAccount.getEmail();
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

}
