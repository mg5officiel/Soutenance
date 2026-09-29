package ml.cmtg.cliniqueManager.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ml.cmtg.cliniqueManager.entity.TypeConsultation;

@Repository
public interface TypeConsultationDAO extends JpaRepository<TypeConsultation, Long> {

}
