package no.isi.insight.planning.model;

import java.time.Duration;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor
@Table(name = PasswordResetCode.TABLE_NAME)
public class PasswordResetCode {

  public static final String TABLE_NAME = "password_reset_code";

  @Id
  @Column(name = "reset_code")
  private String code;

  @ManyToOne
  @JoinColumn(name = "fk_user_account_id")
  private UserAccount user;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  @Column(name = "used_at")
  private LocalDateTime usedAt;

  public PasswordResetCode(
      UserAccount user,
      String code,
      Duration validityPeriod
  ) {
    this.user = user;
    this.code = code;
    this.expiresAt = LocalDateTime.now().plus(validityPeriod);
  }

  /**
   * Returns true if the reset code is expired.
   * 
   * @return true if the reset code is expired
   */
  public boolean isExpired() {
    return LocalDateTime.now().isAfter(this.expiresAt);
  }

  /**
   * Marks the code as used.
   */
  public void markUsed() {
    this.usedAt = LocalDateTime.now();
  }

}
