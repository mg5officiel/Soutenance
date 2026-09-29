package ml.cmtg.cliniqueManager.entity;

import jakarta.persistence.*;
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

    @Column(nullable = false, length = 20)
    private String prenom;

    @Column(nullable = false, length = 20)
    private String nom;

    @Column(nullable = false, length = 8)
    private String telephone;

    @Column(nullable = false, length = 20)
    private String adresse;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 5)
    private Sexe sexe;

    @JsonIgnore
    @OneToMany(mappedBy = "patient")
    private List<Consultation> consultations = new ArrayList<>();

}