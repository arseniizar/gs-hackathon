package myapp.backendcore.controller;

import myapp.backendcore.service.ChallengeService;
import myapp.backendcore.dto.ChallengeResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    private final ChallengeService challengeService;

    public ChallengeController(ChallengeService challengeService) {
        this.challengeService = challengeService;
    }

    @GetMapping
    public ResponseEntity<List<ChallengeResponse>> getAllChallenges() {
        return ResponseEntity.ok(challengeService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChallengeResponse> getChallengeById(@PathVariable String id) {
        return ResponseEntity.ok(challengeService.getById(id));
    }
}