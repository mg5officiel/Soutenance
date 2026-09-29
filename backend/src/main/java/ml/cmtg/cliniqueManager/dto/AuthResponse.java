package ml.cmtg.cliniqueManager.dto;

/**
 * Réponse renvoyée après register ou login.
 * Contient l'access token (+ optionnellement un refresh token).
 */
public record AuthResponse(
        String accessToken,
        String refreshToken,
        String tokenType
) {
    /** Constructeur simplifié sans refresh token. */
    public AuthResponse(String accessToken) {
        this(accessToken, null, "Bearer");
    }

    public AuthResponse(String accessToken, String refreshToken) {
        this(accessToken, refreshToken, "Bearer");
    }
}
