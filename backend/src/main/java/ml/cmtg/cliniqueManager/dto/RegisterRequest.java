package ml.cmtg.cliniqueManager.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import ml.cmtg.cliniqueManager.entity.Role;

public record RegisterRequest(
        @NotBlank(message = "Le nom d'utilisateur est obligatoire")
        @Size(min = 3, max = 50, message = "Le nom d'utilisateur doit faire entre 3 et 50 caractères")
        String username,

        @NotBlank
        @Size(min = 8, message = "Le mot de passe doit faire au moins 8 caractères")
        String password,

        @NotNull(message = "Le rôle est obligatoire")
        Role role,

        Long personnelId
) {
}
