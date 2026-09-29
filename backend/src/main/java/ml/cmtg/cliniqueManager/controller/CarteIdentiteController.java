package ml.cmtg.cliniqueManager.controller;

import ml.cmtg.cliniqueManager.dto.CarteIdentiteDTO;
import ml.cmtg.cliniqueManager.entity.Patient;
import ml.cmtg.cliniqueManager.entity.Sexe;
import ml.cmtg.cliniqueManager.services.GeminiCarteIdentiteService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/cartes-identite")
public class CarteIdentiteController {

    private static final long MAX_IMAGE_SIZE = 10L * 1024 * 1024;

    private final GeminiCarteIdentiteService geminiCarteIdentiteService;

    public CarteIdentiteController(GeminiCarteIdentiteService geminiCarteIdentiteService) {
        this.geminiCarteIdentiteService = geminiCarteIdentiteService;
    }

    @PostMapping(value = "/extraire", consumes = "multipart/form-data")
    public ResponseEntity<?> extraire(@RequestParam("fichier") MultipartFile fichier) {
        if (fichier.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucun fichier fourni.");
        }
        if (fichier.getSize() > MAX_IMAGE_SIZE) {
            return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                    .body("L'image ne doit pas dépasser 10 Mo.");
        }
        if (fichier.getContentType() == null || !fichier.getContentType().startsWith("image/")) {
            return ResponseEntity.badRequest().body("Le fichier doit être une image.");
        }
        try {
            CarteIdentiteDTO donnees = geminiCarteIdentiteService.extraireDonnees(fichier);
            return ResponseEntity.ok(donnees);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Échec de l'extraction via Gemini : " + e.getMessage());
        }
    }

    /**
     * Extrait les données de la carte et renvoie directement un Patient
     * pré-rempli (prénom, nom, sexe) — non enregistré en base. Le frontend
     * peut afficher ce Patient dans le formulaire de création, laisser
     * l'utilisateur compléter téléphone/adresse (absents de la carte),
     * puis envoyer l'objet complété à POST /patients/new pour l'enregistrer.
     */
    @PostMapping(value = "/extraire-patient", consumes = "multipart/form-data")
    public ResponseEntity<?> extrairePatient(@RequestParam("fichier") MultipartFile fichier) {
        if (fichier.isEmpty()) {
            return ResponseEntity.badRequest().body("Aucun fichier fourni.");
        }
        try {
            CarteIdentiteDTO donnees = geminiCarteIdentiteService.extraireDonnees(fichier);
            Patient patient = versPatient(donnees);
            return ResponseEntity.ok(patient);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("Échec de l'extraction via Gemini : " + e.getMessage());
        }
    }

    private Patient versPatient(CarteIdentiteDTO donnees) {
        Patient patient = new Patient();
        patient.setPrenom(donnees.getPrenom());
        patient.setNom(donnees.getNom());
        patient.setSexe(convertirSexe(donnees.getSexe()));
        // telephone et adresse n'existent pas sur la carte d'identité :
        // laissés vides, à compléter manuellement côté formulaire avant
        // l'appel à POST /patients/new (colonnes NOT NULL en base).
        return patient;
    }

    private Sexe convertirSexe(String valeurBrute) {
        if (valeurBrute == null || valeurBrute.isBlank()) {
            return null;
        }
        String valeur = valeurBrute.trim().toUpperCase();
        if (valeur.equals("M") || valeur.startsWith("HOMME") || valeur.startsWith("MASC")) {
            return Sexe.HOMME;
        }
        if (valeur.equals("F") || valeur.startsWith("FEMME") || valeur.startsWith("FEM")) {
            return Sexe.FEMME;
        }
        // Valeur inattendue renvoyée par Gemini : on laisse le champ vide
        // plutôt que de faire échouer toute la requête pour ce seul champ.
        return null;
    }
}
