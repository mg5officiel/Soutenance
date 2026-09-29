package ml.cmtg.cliniqueManager.controller;

import lombok.RequiredArgsConstructor;
import ml.cmtg.cliniqueManager.dao.UserDAO;
import ml.cmtg.cliniqueManager.dao.PersonnelDAO;
import ml.cmtg.cliniqueManager.dto.AuthResponse;
import ml.cmtg.cliniqueManager.dto.LoginRequest;
import ml.cmtg.cliniqueManager.dto.RegisterRequest;
import ml.cmtg.cliniqueManager.dto.RefreshRequest;
import ml.cmtg.cliniqueManager.entity.Role;
import ml.cmtg.cliniqueManager.services.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import ml.cmtg.cliniqueManager.entity.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserDAO userDAO;
    private final PersonnelDAO personnelDAO;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest r) {

        if (userDAO.findByUsername(r.username()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username '" + r.username() + "' déjà utilisé.");
        }

        var userBuilder = User.builder()
                .username(r.username())
                .password(passwordEncoder.encode(r.password()))
                .role(r.role());

        if (r.personnelId() != null) {
            var personnel = personnelDAO.findById(r.personnelId())
                    .orElseThrow(() -> new IllegalArgumentException("Personnel introuvable."));
            if (userDAO.findAll().stream().anyMatch(u -> u.getPersonnel() != null && u.getPersonnel().getId().equals(personnel.getId()))) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Ce personnel est déjà associé à un utilisateur.");
            }
            userBuilder.personnel(personnel);
        }

        var user = userBuilder.build();

        userDAO.save(user);

        return ResponseEntity.status(HttpStatus.CREATED)
        .body("Utilisateur '" + r.username() + "' créé avec le rôle " + r.role());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest r) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(r.username(), r.password())
        );

        var user = userDAO.findByUsername(r.username()).orElseThrow();

        String accessToken  = jwtService.generateToken(user);
        String refreshToken = jwtService.generateRefreshToken(user);

        return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@Valid @RequestBody RefreshRequest request) {
        try {
            if (!jwtService.isRefreshToken(request.refreshToken())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalide ou expiré.");
            }

            String username = jwtService.extractUsername(request.refreshToken());
            User user = userDAO.findByUsername(username)
                    .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable."));

            String accessToken = jwtService.generateToken(user);
            String refreshToken = jwtService.generateRefreshToken(user);
            return ResponseEntity.ok(new AuthResponse(accessToken, refreshToken));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token invalide ou expiré.");
        }
    }

}
