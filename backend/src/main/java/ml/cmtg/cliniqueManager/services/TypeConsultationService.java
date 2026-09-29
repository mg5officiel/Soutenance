package ml.cmtg.cliniqueManager.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import ml.cmtg.cliniqueManager.dao.TypeConsultationDAO;
import ml.cmtg.cliniqueManager.entity.TypeConsultation;

@Service
@Transactional
public class TypeConsultationService {
	
	@Autowired
	private TypeConsultationDAO typeConsultationDAO;
	
	public List<TypeConsultation> findAll() {
        return this.typeConsultationDAO.findAll();
    }
 
    public Optional<TypeConsultation> findById(Long id) {
        return this.typeConsultationDAO.findById(id);
    }
 
    public TypeConsultation save(TypeConsultation type) {
        return this.typeConsultationDAO.save(type);
    }
 
    public TypeConsultation update(Long id, TypeConsultation type) {
        TypeConsultation existing = typeConsultationDAO.findById(id)
                .orElseThrow(() -> new RuntimeException("Type non trouvé : " + id));
        existing.setType(type.getType());
        existing.setMontant(type.getMontant());
        existing.setDescription(type.getDescription());
        return this.typeConsultationDAO.save(existing);
    }
 
    public void deleteById(Long id) {
        this.typeConsultationDAO.deleteById(id);
    }

}
