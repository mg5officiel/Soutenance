package ml.cmtg.cliniqueManager.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import ml.cmtg.cliniqueManager.dao.DossierMedicalDAO;
import ml.cmtg.cliniqueManager.dao.PatientDAO;
import ml.cmtg.cliniqueManager.entity.DossierMedical;
import ml.cmtg.cliniqueManager.entity.Patient;

@Service
@Transactional
public class DossierMedicalService {

    @Autowired
    private DossierMedicalDAO dossierMedicalDAO;
    @Autowired
    private PatientDAO patientDAO;

    // Créer un dossier médical
    public DossierMedical save(DossierMedical dossier) {
        Patient patient = patientDAO.findById(dossier.getPatient().getId())
                .orElseThrow(() -> new IllegalArgumentException("Patient introuvable."));
        if (dossierMedicalDAO.findByPatient(patient).isPresent()) {
            throw new IllegalArgumentException("Ce patient possède déjà un dossier médical.");
        }
        dossier.setPatient(patient);
        return this.dossierMedicalDAO.save(dossier);
    }

    public List<DossierMedical> findAll() {
        return dossierMedicalDAO.findAll();
    }

    // Récupérer un dossier par id
    public Optional<DossierMedical> findById(Long id) {
        return this.dossierMedicalDAO.findById(id);
    }

    // Récupérer le dossier médical brut d'un patient (sans les consultations)
    public Optional<DossierMedical> findByPatientId(Long patientId) {
        Patient patient = patientDAO.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient non trouvé : " + patientId));
        return dossierMedicalDAO.findByPatient(patient);
    }

    // Modifier un dossier médical (saisi manuellement par le personnel)
    public DossierMedical update(Long id, DossierMedical dossier) {
        DossierMedical existing = dossierMedicalDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Dossier médical non trouvé : " + id));
        existing.setGroupeSanguin(dossier.getGroupeSanguin());
        existing.setAllergies(dossier.getAllergies());
        existing.setTraitementEnCours(dossier.getTraitementEnCours());
        return this.dossierMedicalDAO.save(existing);
    }

    // Supprimer un dossier médical
    public void deleteById(Long id) {
        this.dossierMedicalDAO.deleteById(id);
    }
}
