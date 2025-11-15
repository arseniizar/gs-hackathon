package myapp.backendcore.controller;

import jakarta.validation.Valid;
import myapp.backendcore.dto.AuthResponse;
import myapp.backendcore.dto.LoginRequest;
import myapp.backendcore.dto.RegisterRequest;
import myapp.backendcore.model.User;
import myapp.backendcore.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody RegisterRequest req) {
        User user = authService.register(
                req.getEmail(),
                req.getPassword(),
                req.getDisplayName()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        AuthResponse response = authService.login(req.getEmail(), req.getPassword());
        return ResponseEntity.ok(response);
    }
}
