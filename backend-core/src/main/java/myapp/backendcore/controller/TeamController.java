package myapp.backendcore.controller;

import jakarta.validation.Valid;
import myapp.backendcore.dto.TeamProfileUpdateRequest;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final UserRepository userRepository;

    public TeamController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/profile")
    public ResponseEntity<User> getMyProfile(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateMyProfile(Authentication authentication, @Valid @RequestBody TeamProfileUpdateRequest request) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setTeamName(request.getTeamName());
        user.setTeamMembers(request.getTeamMembers());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(updatedUser);
    }
}