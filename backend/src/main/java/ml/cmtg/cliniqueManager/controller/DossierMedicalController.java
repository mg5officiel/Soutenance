package ml.cmtg.cliniqueManager.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ml.cmtg.cliniqueManager.entity.DossierMedical;
import ml.cmtg.cliniqueManager.services.DossierMedicalService;

@RestController
@RequestMapping("/dossier-medical")
public class DossierMedicalController {

    @Autowired
    private DossierMedicalService dossierMedicalService;

    // GET /dossier-medical  → liste complète
    @GetMapping
    public List<DossierMedical> findAll() {
        return this.dossierMedicalService.findAll();
    }

    // Créer un dossier médical
    @PostMapping("/new")
    public DossierMedical save(@Valid @RequestBody DossierMedical dossier) {
        return this.dossierMedicalService.save(dossier);
    }

    // Récupérer un dossier par id
    @GetMapping("/{id}")
    public Optional<DossierMedical> findById(@PathVariable Long id) {
        return this.dossierMedicalService.findById(id);
    }

    // Récupérer le dossier médical brut d'un patient (sans les consultations)
    @GetMapping("/patient/{patientId}")
    public Optional<DossierMedical> findByPatientId(@PathVariable Long patientId) {
        return this.dossierMedicalService.findByPatientId(patientId);
    }

    // Modifier un dossier médical
    @PutMapping("/update/{id}")
    public DossierMedical update(@PathVariable Long id, @Valid @RequestBody DossierMedical dossier) {
        return this.dossierMedicalService.update(id, dossier);
    }

    // Supprimer un dossier médical
    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        this.dossierMedicalService.deleteById(id);
    }
}
