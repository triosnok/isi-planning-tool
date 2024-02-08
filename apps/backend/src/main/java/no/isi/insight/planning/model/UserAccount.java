package no.isi.insight.planning.model;

import java.io.Serializable;
import java.util.Date;
import java.util.UUID;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * A user account in the database.
 */
@Getter
@Entity
@NoArgsConstructor
public class UserAccount implements Serializable {

  public static final String TABLE_NAME = "user_account";
  public static final String PRIMARY_KEY = "user_account_id";

  @Id
  @Column(name = PRIMARY_KEY)
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID userAccountId; // Generated UUID

  @Setter
  @Column(name = "full_name")
  private String fullName;

  @Setter
  @Column(name = "email", unique = true)
  private String email;

  @Setter
  @Column(name = "phone_number")
  private String phoneNumber;

  @Setter
  @Column(name = "password")
  private String password;

  @Setter
  @Enumerated(EnumType.STRING)
  @JdbcTypeCode(SqlTypes.NAMED_ENUM)
  @Column(name = "role")
  private UserAccountRole role;

  @CreationTimestamp
  @Column(name = "created_at")
  private Date createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private Date updatedAt;

  /**
   * Create a user account.
   * 
   * @param fullName    the full name of the user
   * @param email       the email of the user
   * @param phoneNumber the phone number of the user
   * @param password    the password of the user
   * @param role        the role of the user
   */
  public UserAccount(
      String fullName,
      String email,
      String phoneNumber,
      String password,
      UserAccountRole role
  ) {
    this.fullName = fullName;
    this.phoneNumber = phoneNumber;
    this.email = email;
    this.password = password;
    this.role = role;
  }

}
