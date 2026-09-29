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
import ml.cmtg.cliniqueManager.entity.Personnel;
import ml.cmtg.cliniqueManager.services.PersonnelService;

@RestController
@RequestMapping("/personnels")
public class PersonnelController {
	
	@Autowired
	private PersonnelService personnelService;
	
	//Enregistrer un nouveau personnel
	@PostMapping("/new")
	public Personnel save(@RequestBody Personnel personnel) {
		return this.personnelService.save(personnel);
	}
	
	//Liste de tous le personnel
	@GetMapping()
	public List<Personnel> findAll() {
		return this.personnelService.findAll();
	}
	
	//Récupérer un personnel par id
    @GetMapping("/{id}")
    public Optional<Personnel> findById(@PathVariable Long id) {
        return this.personnelService.findById(id);
    }

    //Récupérer le personnel par spécialité
    @GetMapping("/specialite/{specialite}")
    public List<Personnel> findBySpecialite(@PathVariable String specialite) {
        return this.personnelService.findBySpecialite(specialite);
    }
    
  //Rechercher par prénom
    @GetMapping("/prenom/{prenom}")
    public List<Personnel> findByPrenom(@PathVariable String prenom) {
        return this.personnelService.findByPrenom(prenom);
    }

    //Rechercher par nom
    @GetMapping("/nom/{nom}")
    public List<Personnel> findByNom(@PathVariable String nom) {
        return this.personnelService.findByNom(nom);
    }


    //Modifier un personnel
    @PutMapping("/update/{id}")
    public Personnel update(@PathVariable Long id, @RequestBody Personnel personnel) {
        return this.personnelService.update(id, personnel);
    }
	
	//Supprimer un personnel
	@DeleteMapping("/delete/{id}")
	public void deleteById(@PathVariable Long id) {
		this.personnelService.deleteById(id);
	}

}
