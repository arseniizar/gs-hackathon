package myapp.backendcore.controller;

import myapp.backendcore.dto.LeaderboardEntryDto;
import myapp.backendcore.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/challenges")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping("/{challengeId}/leaderboard")
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(@PathVariable String challengeId) {
        List<LeaderboardEntryDto> leaderboard = leaderboardService.getLeaderboardForChallenge(challengeId);
        return ResponseEntity.ok(leaderboard);
    }
}