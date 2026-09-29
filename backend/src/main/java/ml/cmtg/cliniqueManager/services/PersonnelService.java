package ml.cmtg.cliniqueManager.services;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import ml.cmtg.cliniqueManager.dao.PersonnelDAO;
import ml.cmtg.cliniqueManager.entity.Personnel;

@Service
@Transactional
public class PersonnelService {
	
	@Autowired
	private PersonnelDAO personnelDAO;
	
	//Enregistrement
	public Personnel save(Personnel personnel) {
		this.personnelDAO.save(personnel);
		return personnel;
	}
		
	//Recuper
	public List<Personnel> findAll() {
		return this.personnelDAO.findAll();
	}
	
	//Récupérer un médecin par id
	public Optional<Personnel> findById(Long id) {
	    return this.personnelDAO.findById(id);
	}

	//Récupérer les médecins par spécialité
	public List<Personnel> findBySpecialite(String specialite) {
	    return this.personnelDAO.findBySpecialite(specialite);
	}
	
	//Récupérer les médecins par prenom
	public List<Personnel> findByPrenom(String prenom) {
	    return this.personnelDAO.findByPrenom(prenom);
	}
	
	//Récupérer les médecins par nom
	public List<Personnel> findByNom(String nom) {
	    return this.personnelDAO.findByNom(nom);
	}

	//Modifier un médecin
	public Personnel update(Long id, Personnel personnel) {
	    Personnel existing = personnelDAO.findById(id)
	            .orElseThrow(() -> new RuntimeException("Médecin non trouvé avec l'id : " + id));
	    existing.setNom(personnel.getNom());
	    existing.setPrenom(personnel.getPrenom());
	    existing.setSpecialite(personnel.getSpecialite());
	    existing.setTelephone(personnel.getTelephone());
	    existing.setAdresse(personnel.getAdresse());
	    existing.setType(personnel.getType());
	    return this.personnelDAO.save(existing);
	}
	
	//Supprimer
	public void deleteById(Long id) {
		this.personnelDAO.deleteById(id);
	}

}