package ml.cmtg.cliniqueManager.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import ml.cmtg.cliniqueManager.dao.ConsultationDAO;
import ml.cmtg.cliniqueManager.dao.PersonnelDAO;
import ml.cmtg.cliniqueManager.dao.PatientDAO;
import ml.cmtg.cliniqueManager.dao.TypeConsultationDAO;
import ml.cmtg.cliniqueManager.entity.Consultation;
import ml.cmtg.cliniqueManager.entity.Personnel;
import ml.cmtg.cliniqueManager.entity.Patient;

@Service
@Transactional
public class ConsultationService {
	
	@Autowired
	private ConsultationDAO consultationDAO;
	@Autowired
    private PatientDAO patientDAO;
    @Autowired
    private PersonnelDAO personnelDAO;
    @Autowired
    private TypeConsultationDAO typeConsultationDAO;
	
	//Enregistrement d'une connsultation
    public Consultation save(Consultation consultation) {
        consultation.setPatient(resolvePatient(consultation.getPatient()));
        consultation.setPersonnel(resolvePersonnel(consultation.getPersonnel()));
        consultation.setType(typeConsultationDAO.findById(consultation.getType().getId())
                .orElseThrow(() -> new IllegalArgumentException("Type de consultation introuvable.")));
        return this.consultationDAO.save(consultation);
    }
	
	//Recuper toutes les consultations
	public List<Consultation> findAll() {
		return this.consultationDAO.findAll();
	}
	
	//Recuper une consultation par id
	public Optional<Consultation> findById(Long id) {
		return this.consultationDAO.findById(id);
	}
	
	//Consultations d'un patient
	public List<Consultation> findByPatientId(Long patientId) {
		Patient patient = patientDAO.findById(patientId)
				.orElseThrow(() -> new RuntimeException("Patient non trouvé : " + patientId));
	    return this.consultationDAO.findByPatient(patient);
	}

	//Consultations d'un médecin
	public List<Consultation> findByMedecinId(Long personnelId) {
		Personnel personnel = personnelDAO.findById(personnelId)
				.orElseThrow(() -> new RuntimeException("Médecin non trouvé : " + personnelId));
	    return this.consultationDAO.findByPersonnel(personnel);
	}
	
	// Modifier une consultation
    public Consultation update(Long id, Consultation consultation) {
        Consultation existing = consultationDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Consultation non trouvée avec l'id : " + id));
        existing.setDate(consultation.getDate());
        existing.setMotif(consultation.getMotif());
        existing.setPatient(resolvePatient(consultation.getPatient()));
        existing.setPersonnel(resolvePersonnel(consultation.getPersonnel()));
        existing.setType(typeConsultationDAO.findById(consultation.getType().getId())
                .orElseThrow(() -> new IllegalArgumentException("Type de consultation introuvable.")));
        return this.consultationDAO.save(existing);
    }
	
	//Supprimer une consultation
	public void deleteById(Long id) {
		this.consultationDAO.deleteById(id);
	}
    private Patient resolvePatient(Patient patient) {
        if (patient == null || patient.getId() == null) {
            throw new IllegalArgumentException("Patient obligatoire.");
        }
        return patientDAO.findById(patient.getId())
                .orElseThrow(() -> new IllegalArgumentException("Patient introuvable."));
    }

    private Personnel resolvePersonnel(Personnel personnel) {
        if (personnel == null || personnel.getId() == null) {
            throw new IllegalArgumentException("Personnel obligatoire.");
        }
        return personnelDAO.findById(personnel.getId())
                .orElseThrow(() -> new IllegalArgumentException("Personnel introuvable."));
    }

}
