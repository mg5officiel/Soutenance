package ml.cmtg.cliniqueManager.services;

import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	
	@Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;
    
 // ── Génération ───────────────────────────────────────────────────────────

    public String generateToken(UserDetails user) {
        Map<String, Object> claims = new HashMap<>();
        // Injecte le premier rôle de l'utilisateur dans le token
        user.getAuthorities().stream()
                .findFirst()
                .ifPresent(a -> claims.put("role", a.getAuthority()));
        return generateToken(claims, user);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails user) {
        return buildToken(extraClaims, user, jwtExpiration);
    }

    public String generateRefreshToken(UserDetails user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", "refresh");
        return buildToken(claims, user, refreshExpiration);
    }
	
	public String buildToken(Map<String, Object> extraClaims, UserDetails user, long expiration) {
		return Jwts.builder()
			.claims(extraClaims)
			.subject(user.getUsername())
			.issuedAt(new Date())
			.expiration(new Date(System.currentTimeMillis() + expiration))
			.signWith(getSigningKey()).compact();
	}
	
	// ── Validation
	public boolean isValid(String token, UserDetails userDetails) {
		return extractUsername(token).equals(userDetails.getUsername()) && !isExpired(token);
	}
	
	// ── Extraction ───────────────────────────────────────────────────────────

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // ── Utilitaires privés ───────────────────────────────────────────────────

    private boolean isExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = Base64.getDecoder().decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public boolean isRefreshToken(String token) {
        try {
            return "refresh".equals(extractClaim(token, claims -> claims.get("type", String.class)))
                    && !isExpired(token);
        } catch (RuntimeException e) {
            return false;
        }
    }

}
