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
    private final UserRepository repo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

//    public User register(String email, String password, String displayName) {
//        if (repo.existsByEmail(email)) throw new IllegalArgumentException("Email in use");
//        User u = User.builder()
//                .email(email)
//                .passwordHash(passwordEncoder.encode(password))
//                .displayName(displayName)
//                .roles(Set.of("ROLE_USER"))
//                .build();
//        return repo.save(u);
//    }
//
//    public String login(String email, String password) {
//        var opt = repo.findByEmail(email);
//        if (opt.isEmpty()) throw new IllegalArgumentException("Invalid credentials");
//        User u = opt.get();
//        if (!passwordEncoder.matches(password, u.getPasswordHash())) throw new IllegalArgumentException("Invalid credentials");
//        return jwtUtil.generateToken(u.getId(), u.getEmail(), u.getRoles());
//    }
}