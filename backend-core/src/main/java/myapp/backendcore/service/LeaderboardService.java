package myapp.backendcore.service;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.dto.LeaderboardEntry;
import myapp.backendcore.exception.ResourceNotFoundException;
import myapp.backendcore.model.*;
import myapp.backendcore.repository.ChallengeRepository;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;

    /**
     * BEST submission per user (official leaderboard)
     */
    public List<LeaderboardEntry> getLeaderboard(String challengeId) {

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found"));

        String metric = challenge.getMetric().toLowerCase();

        List<Submission> submissions = submissionRepository.findByChallengeIdAndStatus(
                challengeId,
                SubmissionStatus.DONE
        );

        // Map userId → best submission
        Map<String, Submission> bestSubmissions = new HashMap<>();

        for (Submission s : submissions) {
            if (s.getScore() == null) continue;

            Submission existing = bestSubmissions.get(s.getUserId());
            if (existing == null) {
                bestSubmissions.put(s.getUserId(), s);
            } else {
                bestSubmissions.put(s.getUserId(), pickBetterSubmission(existing, s, metric));
            }
        }

        // Sort by metric
        List<Submission> sorted = sortSubmissions(new ArrayList<>(bestSubmissions.values()), metric);

        AtomicInteger rankCounter = new AtomicInteger(1);

        return sorted.stream()
                .map(sub -> {
                    User user = userRepository.findById(sub.getUserId()).orElse(null);

                    return LeaderboardEntry.builder()
                            .rank(rankCounter.getAndIncrement())
                            .userDisplayName(user != null ? user.getDisplayName() : "Unknown")
                            .score(sub.getScore())
                            .submissionId(sub.getId())
                            .submittedAt(sub.getCreatedAt())
                            .build();
                })
                .toList();
    }

    /**
     * FULL leaderboard: all submissions (not grouped)
     */
    public List<LeaderboardEntry> getFullLeaderboard(String challengeId) {

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found"));

        String metric = challenge.getMetric().toLowerCase();

        List<Submission> submissions = submissionRepository.findByChallengeIdAndStatus(
                challengeId,
                SubmissionStatus.DONE
        );

        submissions = sortSubmissions(submissions, metric);

        AtomicInteger rankCounter = new AtomicInteger(1);

        return submissions.stream()
                .map(sub -> {
                    User user = userRepository.findById(sub.getUserId()).orElse(null);

                    return LeaderboardEntry.builder()
                            .rank(rankCounter.getAndIncrement())
                            .userDisplayName(user != null ? user.getDisplayName() : "Unknown")
                            .score(sub.getScore())
                            .submissionId(sub.getId())
                            .submittedAt(sub.getCreatedAt())
                            .build();
                })
                .toList();
    }

    /**
     * Utility: pick better submission based on metric
     */
    private Submission pickBetterSubmission(Submission s1, Submission s2, String metric) {
        boolean lowerIsBetter = metric.equals("rmse") || metric.equals("mae") || metric.equals("mse");

        if (lowerIsBetter) {
            return s1.getScore() <= s2.getScore() ? s1 : s2;
        }
        return s1.getScore() >= s2.getScore() ? s1 : s2;
    }

    /**
     * Utility: sort submissions by metric
     */
    private List<Submission> sortSubmissions(List<Submission> submissions, String metric) {
        boolean lowerIsBetter = metric.equals("rmse") || metric.equals("mae") || metric.equals("mse");

        if (lowerIsBetter) {
            return submissions.stream()
                    .sorted(Comparator.comparingDouble(Submission::getScore))
                    .toList();
        } else {
            return submissions.stream()
                    .sorted(Comparator.comparingDouble(Submission::getScore).reversed())
                    .toList();
        }
    }
}