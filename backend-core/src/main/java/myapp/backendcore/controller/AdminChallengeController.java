package myapp.backendcore.controller;

import myapp.backendcore.dto.ChallengeCreateRequest;
import myapp.backendcore.dto.ChallengeResponse;
import myapp.backendcore.dto.ChallengeUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import myapp.backendcore.service.ChallengeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/challenges")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminChallengeController {

    private final ChallengeService challengeService;

    @PostMapping
    public ResponseEntity<ChallengeResponse> createChallenge(
            @Valid @RequestBody ChallengeCreateRequest request
    ) {
        ChallengeResponse response = challengeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChallengeResponse> updateChallenge(
            @PathVariable String id,
            @Valid @RequestBody ChallengeUpdateRequest request
    ) {
        ChallengeResponse response = challengeService.update(id, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChallengeResponse> getChallenge(
            @PathVariable String id
    ) {
        ChallengeResponse response = challengeService.getById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ChallengeResponse>> getAllChallenges() {
        List<ChallengeResponse> responses = challengeService.getAll();
        return ResponseEntity.ok(responses);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(
            @PathVariable String id
    ) {
        challengeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}