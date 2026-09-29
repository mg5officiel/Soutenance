package ml.cmtg.cliniqueManager.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ml.cmtg.cliniqueManager.entity.DossierMedical;
import ml.cmtg.cliniqueManager.entity.Patient;

public interface DossierMedicalDAO extends JpaRepository<DossierMedical, Long> {
    Optional<DossierMedical> findByPatient(Patient patient);
}
