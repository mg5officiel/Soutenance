package ml.cmtg.cliniqueManager.controller;

import lombok.RequiredArgsConstructor;
import ml.cmtg.cliniqueManager.dao.ConsultationDAO;
import ml.cmtg.cliniqueManager.dao.DossierMedicalDAO;
import ml.cmtg.cliniqueManager.dao.PatientDAO;
import ml.cmtg.cliniqueManager.dao.PersonnelDAO;
import ml.cmtg.cliniqueManager.dto.DashboardNumber;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final PatientDAO        patientDAO;
    private final ConsultationDAO   consultationDAO;
    private final DossierMedicalDAO dossierMedicalDAO;
    private final PersonnelDAO      personnelDAO;

    @GetMapping("/stats")
    public ResponseEntity<DashboardNumber> stats() {
        return ResponseEntity.ok(new DashboardNumber(
                patientDAO.count(),
                consultationDAO.count(),
                dossierMedicalDAO.count(),
                personnelDAO.count()
        ));
    }
}