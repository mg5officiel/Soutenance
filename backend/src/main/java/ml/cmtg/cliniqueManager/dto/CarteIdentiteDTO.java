package ml.cmtg.cliniqueManager.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;

@JsonIgnoreProperties(ignoreUnknown = true)
@Getter
@Setter
public class CarteIdentiteDTO {

    private String typeCarte;
    private String numeroCarte;
    private String nina;
    private String prenom;
    private String nom;
    private String sexe;
    private String nationalite;
    private String dateNaissance;
    private String lieuNaissance;
    private String dateDelivrance;
    private String dateExpiration;
    private String profession;

    public CarteIdentiteDTO() {
    }

}
