package no.isi.insight.planning.db.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Embeddable
@NoArgsConstructor
public class Audit {

  @CreationTimestamp
  @Column(name = "created_at")
  private LocalDateTime createdAt;

  @ManyToOne
  @JoinColumn(name = "fk_created_by_user_id", referencedColumnName = UserAccount.PRIMARY_KEY)
  private UserAccount createdBy;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @ManyToOne
  @JoinColumn(name = "fk_updated_by_user_id", referencedColumnName = UserAccount.PRIMARY_KEY)
  private UserAccount updatedBy;

  public Audit(
      UserAccount createdBy
  ) {
    this.createdBy = createdBy;
  }

  /**
   * Sets the user account that last modified the entity.
   * 
   * @param userAccount the user account that last modified the entity
   */
  public void setUpdatedBy(
      UserAccount userAccount
  ) {
    this.updatedBy = userAccount;
    this.updatedAt = LocalDateTime.now();
  }

  /**
   * Returns the last modified date of the entity.
   * 
   * @return the last modified date
   */
  public LocalDateTime getLastModifiedAt() {
    return this.updatedAt != null ? this.updatedAt : this.createdAt;
  }

}
