package ml.cmtg.cliniqueManager.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ml.cmtg.cliniqueManager.entity.Patient;

@Repository
public interface PatientDAO extends JpaRepository<Patient, Long> {
	
	List<Patient> findByPrenom(String prenom);
	List<Patient> findByNom(String nom);

}
