package ml.cmtg.cliniqueManager.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ml.cmtg.cliniqueManager.entity.Consultation;
import ml.cmtg.cliniqueManager.entity.Personnel;
import ml.cmtg.cliniqueManager.entity.Patient;

@Repository
public interface ConsultationDAO extends JpaRepository<Consultation, Long> {
	
	List<Consultation> findByPatient(Patient patient);
    List<Consultation> findByPersonnel(Personnel personnel);

}
