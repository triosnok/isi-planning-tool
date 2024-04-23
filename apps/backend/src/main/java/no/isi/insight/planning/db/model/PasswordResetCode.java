package no.isi.insight.planning.db.model;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
  public static final String PRIMARY_KEY = "password_reset_code_id";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @Column(name = "reset_code")
  private String resetCode;

  @Column(name = "confirmation_code")
  private String confirmationCode;

  @ManyToOne
  @JoinColumn(name = "fk_user_account_id")
  private UserAccount user;

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @Column(name = "expires_at")
  private LocalDateTime expiresAt;

  @Column(name = "confirmation_claimed_at")
  private LocalDateTime confirmationClaimedAt;

  @Column(name = "used_at")
  private LocalDateTime usedAt;

  public PasswordResetCode(
      UserAccount user,
      String resetCode,
      String confirmationCode,
      Duration validityPeriod
  ) {
    this.user = user;
    this.resetCode = resetCode;
    this.confirmationCode = confirmationCode;
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

  public void confirmationClaimed() {
    this.confirmationClaimedAt = LocalDateTime.now();
  }

}
