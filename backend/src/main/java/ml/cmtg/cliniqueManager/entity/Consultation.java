package ml.cmtg.cliniqueManager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "consultations")
@Getter
@Setter
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull(message = "La date est obligatoire")
    @Column(nullable = false)
    private LocalDate date;

    @NotBlank(message = "Le motif est obligatoire")
    @Column(nullable = false, length = 255)
    private String motif;

    // une consultation concerne un et un seul patient
    @NotNull(message = "Le patient est obligatoire")
    @ManyToOne
    @JoinColumn(nullable = false)
    private Patient patient;

    // une consultation est effectuee par un et un seul personnel
    @NotNull(message = "Le personnel est obligatoire")
    @ManyToOne
    @JoinColumn(nullable = false)
    private Personnel personnel;

    // une consultation a un seul type
    @NotNull(message = "Le type de consultation est obligatoire")
    @ManyToOne
    @JoinColumn(nullable = false)
    private TypeConsultation type;

}