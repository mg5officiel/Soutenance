package ml.cmtg.cliniqueManager.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import ml.cmtg.cliniqueManager.dao.PatientDAO;
import ml.cmtg.cliniqueManager.entity.Patient;

@Service
@Transactional
public class PatientService {
	
	@Autowired
	private PatientDAO patientDAO;
	
	//Enregistrement d'un patient
	public Patient save(Patient patient) {
		return this.patientDAO.save(patient);
    }
	
	//Recuper tous les patients
	public List<Patient> findAll() {
		return this.patientDAO.findAll();
	}
	
	//Recuper un patient par Id
	public Optional<Patient> getPatientById(Long id) {
	    return this.patientDAO.findById(id);
	}
	
	//Recuper un patient par prenom
	public List<Patient> findByPrenom(String prenom) {
	    return this.patientDAO.findByPrenom(prenom);
	}
	
	//Recuper un patient par nom
	public List<Patient> findByNom(String nom) {
	    return this.patientDAO.findByNom(nom);
	}
	
	//Modifier un patient
	public Patient update(Long id, Patient patient) {
	    Patient existing = patientDAO.findById(id)
	            .orElseThrow(() -> new RuntimeException("Patient non trouvé avec l'id : " + id));
	    existing.setPrenom(patient.getPrenom());
	    existing.setNom(patient.getNom());
	    existing.setTelephone(patient.getTelephone());
	    existing.setAdresse(patient.getAdresse());
	    return this.patientDAO.save(existing);
	}
	
	//Supprimer un patient
	public void deleteById(Long id) {
		this.patientDAO.deleteById(id);
	}

}
