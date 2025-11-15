package myapp.backendcore.controller;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.dto.LeaderboardEntry;
import myapp.backendcore.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/challenges")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    // NOW RETURNS FULL LEADERBOARD
    @GetMapping("/{challengeId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard(
            @PathVariable String challengeId
    ) {
        return ResponseEntity.ok(leaderboardService.getFullLeaderboard(challengeId));
    }

    // Optional alias (still full leaderboard)
    @GetMapping("/{challengeId}/leaderboard/full")
    public ResponseEntity<List<LeaderboardEntry>> getFullLeaderboard(
            @PathVariable String challengeId
    ) {
        return ResponseEntity.ok(leaderboardService.getFullLeaderboard(challengeId));
    }
}