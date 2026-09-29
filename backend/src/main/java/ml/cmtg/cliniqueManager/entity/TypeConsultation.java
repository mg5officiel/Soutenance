package ml.cmtg.cliniqueManager.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;

@Entity
@Table(name = "typeconsultations")
@Getter
@Setter
public class TypeConsultation {
	
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
	
	@Column(nullable = false, length = 50)
    private String type;

    @Column(nullable = false)
    private Long montant;

    @Column(length = 100)
    private String description;

    @JsonIgnore
    @OneToMany(mappedBy = "type")
    private List<Consultation> consultations = new ArrayList<>();

}