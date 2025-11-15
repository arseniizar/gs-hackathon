package myapp.backendcore.service;

import myapp.backendcore.dto.AuthResponse;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.UserRepository;
import myapp.backendcore.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Set;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private static final String ROLE_USER = "ROLE_USER";
    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public User register(String email, String password, String displayName) {

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Hackathon rule: first ever registered user becomes ADMIN
        boolean firstUser = userRepository.count() == 0;
        Set<String> roles = firstUser
                ? Set.of(ROLE_USER, ROLE_ADMIN)
                : Set.of(ROLE_USER);

        if (firstUser) {
            log.warn("⚠️ First user detected — assigning ADMIN role automatically.");
        }

        User user = User.builder()
                .email(email)
                .passwordHash(encoder.encode(password))
                .displayName(displayName)
                .roles(roles)
                .build();

        return userRepository.save(user);
    }

    public AuthResponse login(String email, String password) {
        var u = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!encoder.matches(password, u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(u);
        return new AuthResponse(token, u.getId());
    }
}
