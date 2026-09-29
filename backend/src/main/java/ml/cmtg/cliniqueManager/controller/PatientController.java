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
import ml.cmtg.cliniqueManager.entity.Patient;
import ml.cmtg.cliniqueManager.services.PatientService;

@RestController
@RequestMapping("/patients")
public class PatientController {
	
	@Autowired
	private PatientService patientService;
	
	//Enregistrement
	@PostMapping("/new")
	public Patient save(@RequestBody Patient patient) {
		return this.patientService.save(patient);
	}
	
	//Liste
	@GetMapping()
	public List<Patient> findAll() {
		return this.patientService.findAll();
	}
	
	//Patient par id
	@GetMapping("/{id}")
	public Optional<Patient> getPatientById(@PathVariable Long id) {
	    return this.patientService.getPatientById(id);
	}
	
	//Rechercher par prénom
	@GetMapping("/prenom/{prenom}")
	public List<Patient> findByPrenom(@PathVariable String prenom) {
		return this.patientService.findByPrenom(prenom);
	}

	//Rechercher par nom
	@GetMapping("/nom/{nom}")
	public List<Patient> findByNom(@PathVariable String nom) {
		return this.patientService.findByNom(nom);
	}
	
	//Modifier un patient
    @PutMapping("/update/{id}")
    public Patient update(@PathVariable Long id, @RequestBody Patient patient) {
        return this.patientService.update(id, patient);
    }
	
	//Supprimer
	@DeleteMapping("/delete/{id}")
	public void deleteById(@PathVariable Long id) {
		this.patientService.deleteById(id);
	}

}
