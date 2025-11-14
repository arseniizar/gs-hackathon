package myapp.backendcore.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);

        // Якщо немає заголовка або він не Bearer – просто пропускаємо далі
        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = header.substring(7);

        try {
            // Якщо в тебе в JwtUtil метод називається інакше (getClaims),
            // поміняй тут відповідно:
            Claims claims = jwtUtil.extractClaims(token);
            // Claims claims = jwtUtil.getClaims(token);

            String email = claims.get("email", String.class);

            // roles збережені як List<String> у claims
            List<String> roles = claims.get("roles", List.class);

            Collection<? extends GrantedAuthority> authorities =
                    roles.stream()
                            // Якщо в токені ролі вже йдуть з "ROLE_",
                            // заміни цей рядок на new SimpleGrantedAuthority(role)
                            .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                            .collect(Collectors.toList());

            Authentication auth = new UsernamePasswordAuthenticationToken(
                    email,
                    null,
                    authorities
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (Exception ex) {
            // Якщо токен кривий/протух – просто чистимо контекст і йдемо далі
            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }
}