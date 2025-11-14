package myapp.backendcore.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.UserRepository;
import myapp.backendcore.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    public final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    private static final String ROLE_USER = "ROLE_USER";
    private static final String ROLE_ADMIN = "ROLE_ADMIN";

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

    public String login(String email, String password) {
        var u = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!encoder.matches(password, u.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        return jwtUtil.generateToken(u);
    }
}