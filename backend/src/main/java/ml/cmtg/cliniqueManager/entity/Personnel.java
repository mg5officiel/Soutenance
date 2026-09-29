package ml.cmtg.cliniqueManager.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import java.util.ArrayList;

@Entity
@Table(name = "personnels")
@Getter
@Setter
public class Personnel {
	@Id @GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, length = 20)
	private TypePersonnel type;

	@Column(nullable = false, length = 20)
	private String prenom;

	@Column(nullable = false, length = 20)
	private String nom;

	@Column(nullable = false, length = 8)
	private String telephone;

	@Column(nullable = false, length = 20)
	private String adresse;

	@Column(length = 20)
	private String specialite;

	@JsonIgnore
	@OneToMany(mappedBy = "personnel")
	private List<Consultation> consultations = new ArrayList<>();

}