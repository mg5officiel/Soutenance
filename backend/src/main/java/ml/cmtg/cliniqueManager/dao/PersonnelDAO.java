package ml.cmtg.cliniqueManager.dao;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ml.cmtg.cliniqueManager.entity.Personnel;

@Repository
public interface PersonnelDAO extends JpaRepository<Personnel, Long> {

	List<Personnel> findBySpecialite(String specialite);
	List<Personnel> findByPrenom(String prenom);
	List<Personnel> findByNom(String nom);

}
