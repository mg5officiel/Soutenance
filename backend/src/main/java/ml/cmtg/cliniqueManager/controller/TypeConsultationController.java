package ml.cmtg.cliniqueManager.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ml.cmtg.cliniqueManager.entity.TypeConsultation;
import ml.cmtg.cliniqueManager.services.TypeConsultationService;

@RestController
@RequestMapping("/type-consultation")
public class TypeConsultationController {

    @Autowired
    private TypeConsultationService typeConsultationService;

    // Lister tous les types
    @GetMapping()
    public List<TypeConsultation> findAll() {
        return this.typeConsultationService.findAll();
    }

    // Ajouter un type
    @PostMapping("/new")
    public TypeConsultation save(@RequestBody TypeConsultation type) {
        return this.typeConsultationService.save(type);
    }

    // Modifier un type
    @PutMapping("/update/{id}")
    public TypeConsultation update(@PathVariable Long id, @RequestBody TypeConsultation type) {
        return this.typeConsultationService.update(id, type);
    }

    // Supprimer un type
    @DeleteMapping("/delete/{id}")
    public void deleteById(@PathVariable Long id) {
        this.typeConsultationService.deleteById(id);
    }
}