package ml.cmtg.cliniqueManager.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ml.cmtg.cliniqueManager.dao.UserDAO;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity   // active @PreAuthorize sur les contrôleurs
public class SecurityConfig {
	
	@Bean
    UserDetailsService userDetailsService(UserDAO userDAO) {
        return username -> userDAO.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("Inconnu : " + username));
    }

    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    AuthenticationProvider authProvider(UserDetailsService userDetailsService) {
        var p = new DaoAuthenticationProvider(userDetailsService);
        p.setPasswordEncoder(passwordEncoder());
        return p;
    }
    
    @Bean
    AuthenticationManager authManager(AuthenticationConfiguration c) {
    	return c.getAuthenticationManager();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http,
                                            JwtAuthenticationFilter jwtAuthFilter,
                                            AuthenticationProvider authProvider) throws Exception {
        http
                // Pas de CSRF en API stateless
                .csrf(AbstractHttpConfigurer::disable)

                .cors(Customizer.withDefaults())

                // Aucune session serveur
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // Règles d'accès
                .authorizeHttpRequests(auth -> auth
                        // ── Public ────────────────────────────────────────────────────
                        .requestMatchers("/auth/**").permitAll()

                        // ── Dashboard stats : tout utilisateur authentifié ────────────
                        .requestMatchers("/dashboard/**").authenticated()

                        // ── Profil : tout utilisateur authentifié ─────────────────────
                        .requestMatchers("/user/me").authenticated()

                        // ── Patients : ADMIN + SECRETAIRE ─────────────────────────────
                        .requestMatchers("/patients/**")
                        .hasAnyRole("ADMIN", "SECRETAIRE")

                        // ── Consultations & Dossiers : ADMIN + MEDECIN + INFIRMIER ─────
                        .requestMatchers("/consultations/**", "/dossier-medical/**")
                        .hasAnyRole("ADMIN", "MEDECIN", "INFIRMIER")

                        // ── Personnel & Utilisateurs : ADMIN uniquement ────────────────
                        .requestMatchers("/personnels/**", "/user/users")
                        .hasRole("ADMIN")

                        // ── Tout le reste : authentifié ───────────────────────────────
                        .anyRequest().authenticated()              // tout le reste = token requis
                )

                .authenticationProvider(authProvider)

                // Filtre JWT inséré avant le filtre login/password standard
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
