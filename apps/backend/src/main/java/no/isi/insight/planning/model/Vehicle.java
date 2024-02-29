package no.isi.insight.planning.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(name = "vehicle")
public class Vehicle {

  public static final String PRIMARY_KEY = "vehicle_id";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = PRIMARY_KEY)
  private UUID id;

  @Column(name = "image_url")
  private String imageUrl;

  @Column(name = "registration_number")
  private String registrationNumber;

  @Column(name = "model")
  private String model;

  @Column(name = "camera")
  private Boolean camera;

  @Column(name = "description")
  private String description;

  @Column(name = "gnss_id")
  private String gnssId;

  @Embedded
  private Audit audit;

  public Vehicle(
      String imageUrl,
      String registrationNumber,
      String model,
      Boolean camera,
      String description,
      String gnssId
  ) {
    this.imageUrl = imageUrl;
    this.registrationNumber = registrationNumber;
    this.model = model;
    this.camera = camera;
    this.description = description;
    this.gnssId = gnssId;
  }

}