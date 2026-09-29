package ml.cmtg.cliniqueManager.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;

@Entity
@Table(name = "patients")
@Getter
@Setter
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotBlank(message = "Le prénom est obligatoire")
    @Size(max = 50, message = "Le prénom ne doit pas dépasser 50 caractères")
    @Column(nullable = false, length = 50)
    private String prenom;

    @NotBlank(message = "Le nom est obligatoire")
    @Size(max = 50, message = "Le nom ne doit pas dépasser 50 caractères")
    @Column(nullable = false, length = 50)
    private String nom;

    @NotBlank(message = "Le téléphone est obligatoire")
    @Size(min = 8, max = 20, message = "Le téléphone doit contenir entre 8 et 20 caractères")
    @Column(nullable = false, length = 20)
    private String telephone;

    @NotBlank(message = "L'adresse est obligatoire")
    @Size(max = 150, message = "L'adresse ne doit pas dépasser 150 caractères")
    @Column(nullable = false, length = 150)
    private String adresse;

    @NotNull(message = "Le sexe est obligatoire")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 5)
    private Sexe sexe;

    @JsonIgnore
    @OneToMany(mappedBy = "patient")
    private List<Consultation> consultations = new ArrayList<>();

}