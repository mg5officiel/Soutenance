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

    private static final String TOKEN_TYPE_CLAIM = "type";
    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public String generateToken(UserDetails user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE);
        user.getAuthorities().stream()
                .findFirst()
                .ifPresent(a -> claims.put("role", a.getAuthority()));
        return buildToken(claims, user, jwtExpiration);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails user) {
        Map<String, Object> claims = new HashMap<>(extraClaims);
        claims.putIfAbsent(TOKEN_TYPE_CLAIM, ACCESS_TOKEN_TYPE);
        return buildToken(claims, user, jwtExpiration);
    }

    public String generateRefreshToken(UserDetails user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put(TOKEN_TYPE_CLAIM, REFRESH_TOKEN_TYPE);
        return buildToken(claims, user, refreshExpiration);
    }

    public String buildToken(Map<String, Object> extraClaims, UserDetails user, long expiration) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(user.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean isValid(String token, UserDetails userDetails) {
        try {
            return isAccessToken(token)
                    && extractUsername(token).equals(userDetails.getUsername())
                    && !isExpired(token);
        } catch (RuntimeException e) {
            return false;
        }
    }

    public boolean isAccessToken(String token) {
        try {
            return ACCESS_TOKEN_TYPE.equals(
                    extractClaim(token, claims -> claims.get(TOKEN_TYPE_CLAIM, String.class))
            ) && !isExpired(token);
        } catch (RuntimeException e) {
            return false;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            return REFRESH_TOKEN_TYPE.equals(
                    extractClaim(token, claims -> claims.get(TOKEN_TYPE_CLAIM, String.class))
            ) && !isExpired(token);
        } catch (RuntimeException e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        return claimsResolver.apply(extractAllClaims(token));
    }

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
}
