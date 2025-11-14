package myapp.backendcore.controller;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.dto.LoginRequest;
import myapp.backendcore.model.User;
import myapp.backendcore.service.AuthService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
//        try {
//            User created = authService.register(req.getEmail(), req.getPassword(), req.getDisplayName());
//            return ResponseEntity.status(HttpStatus.CREATED).body(created);
//        } catch (IllegalArgumentException ex) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
//        }
//    }
//
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
//        try {
//            String token = authService.login(req.getEmail(), req.getPassword());
//            var user = authService.getClass(); // avoid returning sensitive info
//            return ResponseEntity.ok(new AuthResponseDto(token, "ok"));
//        } catch (IllegalArgumentException ex) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ex.getMessage());
//        }
//    }
//
//    // DTO used above
//    public static class RegisterRequest {
//        private String email;
//        private String password;
//        private String displayName;
//        // getters/setters
//        public String getEmail(){return email;}
//        public void setEmail(String e){this.email=e;}
//        public String getPassword(){return password;}
//        public void setPassword(String p){this.password=p;}
//        public String getDisplayName(){return displayName;}
//        public void setDisplayName(String d){this.displayName=d;}
//    }
}