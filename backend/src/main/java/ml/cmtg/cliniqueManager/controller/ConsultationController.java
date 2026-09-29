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
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ml.cmtg.cliniqueManager.entity.Consultation;
import ml.cmtg.cliniqueManager.services.ConsultationService;

@RestController
@RequestMapping("/consultations")
public class ConsultationController {
	
	@Autowired
	private ConsultationService consultationService;
	
	//Enregistrement d'une consultation
	@PostMapping("/new")
	public Consultation save(@RequestBody Consultation consultation) {
		return this.consultationService.save(consultation);
	}
	
	//Lister toutes les consultations
	@GetMapping()
	public List<Consultation> findAll() {
		return this.consultationService.findAll();
	}
	
	//Récupérer une consultation par ID
	@GetMapping("/{id}")
	public Optional<Consultation> findById(@PathVariable Long id) {
		return this.consultationService.findById(id);
	}
	
	//Consultations d'un patient
    @GetMapping("/patient/{patientId}")
    public List<Consultation> findByPatientId(@PathVariable Long patientId) {
        return this.consultationService.findByPatientId(patientId);
    }

    //Consultations d'un médecin
    @GetMapping("/medecin/{medecinId}")
    public List<Consultation> findByMedecinId(@PathVariable Long medecinId) {
        return this.consultationService.findByMedecinId(medecinId);
    }
    
 // Modifier une consultation
    @PutMapping("/update/{id}")
    public Consultation update(@PathVariable Long id, @RequestBody Consultation consultation) {
        return this.consultationService.update(id, consultation);
    }
	
	//Supprimer une consultation par id
	@DeleteMapping("/delete/{id}")
	public void deleteById(@PathVariable Long id) {
		this.consultationService.deleteById(id);
	}

}
