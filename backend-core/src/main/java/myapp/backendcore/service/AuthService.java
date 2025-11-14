package myapp.backendcore.service;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.UserRepository;
import myapp.backendcore.security.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    public final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public User register(String email, String password, String displayName) {

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .email(email)
                .passwordHash(encoder.encode(password))
                .displayName(displayName)
                .roles(Set.of("ROLE_USER"))
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