package myapp.backendcore.service;

import myapp.backendcore.dto.LeaderboardEntryDto;
import myapp.backendcore.model.Submission;
import myapp.backendcore.model.SubmissionStatus;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    public LeaderboardService(SubmissionRepository submissionRepository, UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

    public List<LeaderboardEntryDto> getLeaderboardForChallenge(String challengeId) {
        List<Submission> successfulSubmissions = submissionRepository.findByChallengeIdAndStatus(challengeId, SubmissionStatus.DONE);

        Map<String, Submission> bestSubmissionsByUser = successfulSubmissions.stream()
                .collect(Collectors.toMap(
                        Submission::getUserId,
                        Function.identity(),
                        (s1, s2) -> {
                            if (s1.getScore() > s2.getScore()) {
                                return s1;
                            } else if (s2.getScore() > s1.getScore()) {
                                return s2;
                            } else {
                                return s1.getCreatedAt().isBefore(s2.getCreatedAt()) ? s1 : s2;
                            }
                        }
                ));

        List<String> userIds = new ArrayList<>(bestSubmissionsByUser.keySet());
        Map<String, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        List<LeaderboardEntryDto> leaderboardEntries = new ArrayList<>();
        for (Submission submission : bestSubmissionsByUser.values()) {
            User user = userMap.get(submission.getUserId());
            if (user != null) {
                leaderboardEntries.add(new LeaderboardEntryDto(
                        0,
                        // 👇 ЗМІНА: Використовуємо getTeamName() замість getDisplayName()
                        user.getTeamName(),
                        submission.getScore(),
                        submission.getId(),
                        submission.getCreatedAt()
                ));
            }
        }

        leaderboardEntries.sort(Comparator
                .comparing(LeaderboardEntryDto::getScore).reversed()
                .thenComparing(LeaderboardEntryDto::getSubmittedAt)
        );

        for (int i = 0; i < leaderboardEntries.size(); i++) {
            leaderboardEntries.get(i).setRank(i + 1);
        }

        return leaderboardEntries;
    }
}