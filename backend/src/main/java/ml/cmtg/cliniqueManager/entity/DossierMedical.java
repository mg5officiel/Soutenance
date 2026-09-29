package ml.cmtg.cliniqueManager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "dossiermedicals")
@Getter
@Setter
public class DossierMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false)
    private LocalDate dateCreation;

    @Column(length = 10)
    private String groupeSanguin;

    @Column(length = 250)
    private String allergies;

    @Column(length = 250)
    private String traitementEnCours;

    @NotNull(message = "Le patient est obligatoire")
    @OneToOne
    @JoinColumn(nullable = false, unique = true)
    private Patient patient;

    // Initialiser la date automatiquement
    @PrePersist
    public void prePersist() {
        this.dateCreation = LocalDate.now();
    }

}