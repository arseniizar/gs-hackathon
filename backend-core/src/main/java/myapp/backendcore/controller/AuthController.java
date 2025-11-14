package myapp.backendcore.controller;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.dto.LoginRequest;
import myapp.backendcore.dto.RegisterRequest;
import myapp.backendcore.model.User;
import myapp.backendcore.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest req) {
        User user = authService.register(
                req.getEmail(),
                req.getPassword(),
                req.getDisplayName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String token = authService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok().body(new Object() {
            public final String tokenValue = token;
            public String getToken() { return tokenValue; }
        });
    }
}