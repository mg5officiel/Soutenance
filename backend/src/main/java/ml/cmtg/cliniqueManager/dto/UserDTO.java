package ml.cmtg.cliniqueManager.dto;

import ml.cmtg.cliniqueManager.entity.User;
import ml.cmtg.cliniqueManager.entity.Personnel;

public record UserDTO(
        Long id,
        String username,
        String role,
        PersonnelSummary personnel
) {
    public record PersonnelSummary(
        Long id,
        String prenom,
        String nom,
        String type
    ) {
        public static PersonnelSummary from(Personnel personnel) {
            if (personnel == null) return null;
            return new PersonnelSummary(
                personnel.getId(),
                personnel.getPrenom(),
                personnel.getNom(),
                personnel.getType() != null ? personnel.getType().name() : null
            );
        }
    }

    public static UserDTO from(User user) {
        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getRole().name(),
            PersonnelSummary.from(user.getPersonnel())
        );
    }
}
