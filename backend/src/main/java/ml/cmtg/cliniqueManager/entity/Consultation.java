package ml.cmtg.cliniqueManager.entity;

import jakarta.persistence.*;
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

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false, length = 255)
    private String motif;

    // une consultation concerne un et un seul patient
    @ManyToOne
    @JoinColumn(nullable = false)
    private Patient patient;

    // une consultation est effectuee par un et un seul personnel
    @ManyToOne
    @JoinColumn(nullable = false)
    private Personnel personnel;

    // une consultation a un seul type
    @ManyToOne
    @JoinColumn(nullable = false)
    private TypeConsultation type;

}