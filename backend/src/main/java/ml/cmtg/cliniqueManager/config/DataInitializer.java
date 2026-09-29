package ml.cmtg.cliniqueManager.config;

import lombok.RequiredArgsConstructor;
import ml.cmtg.cliniqueManager.dao.UserDAO;
import ml.cmtg.cliniqueManager.entity.Role;
import ml.cmtg.cliniqueManager.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Exécuté automatiquement au démarrage de l'application.
 * Crée le compte admin par défaut s'il n'existe pas encore en base.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationRunner {

    private final UserDAO userDAO;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        if (userDAO.findByUsername(adminUsername).isEmpty()) {
            var admin = User.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode(adminPassword))
                    .role(Role.ADMIN)
                    .build();
            userDAO.save(admin);
        }
    }
}