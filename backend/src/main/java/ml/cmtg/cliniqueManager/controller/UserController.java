package ml.cmtg.cliniqueManager.controller;

import lombok.RequiredArgsConstructor;
import ml.cmtg.cliniqueManager.dao.UserDAO;
import ml.cmtg.cliniqueManager.dto.UserDTO;
import ml.cmtg.cliniqueManager.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserDAO userDAO;

    // Ressource protégée profil de l'utilisateur connecté
    // Accessible à tout utilisateur authentifié (jeton valide requis)
    @GetMapping("/me")
    public ResponseEntity<UserDTO> me(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(UserDTO.from(user));
    }

    // Gestion des rôles
    // Filtrage par méthode via @PreAuthorize (plus fin que la config globale).
    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> listUsers() {
        List<UserDTO> users = userDAO.findAll()
                .stream()
                .map(UserDTO::from)
                .toList();
        return ResponseEntity.ok(users);
    }

    // DELETE — réservé aux ADMIN
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        userDAO.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
