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
        // 1. Отримати всі успішні сабмішени для цього челенджу
        List<Submission> successfulSubmissions = submissionRepository.findByChallengeIdAndStatus(challengeId, SubmissionStatus.DONE);

        // 2. Згрупувати сабмішени по userId і знайти найкращий (найвищий score) для кожного
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
                                // Tie-breaking rule: раніший сабмішен кращий
                                return s1.getCreatedAt().isBefore(s2.getCreatedAt()) ? s1 : s2;
                            }
                        }
                ));

        // 3. Отримати ID всіх користувачів, щоб знайти їхні імена
        List<String> userIds = new ArrayList<>(bestSubmissionsByUser.keySet());
        Map<String, User> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));

        // 4. Створити список DTO з найкращих сабмішенів
        List<LeaderboardEntryDto> leaderboardEntries = new ArrayList<>();
        for (Submission submission : bestSubmissionsByUser.values()) {
            User user = userMap.get(submission.getUserId());
            if (user != null) {
                leaderboardEntries.add(new LeaderboardEntryDto(
                        0, // Ранк буде призначено після сортування
                        user.getDisplayName(),
                        submission.getScore(),
                        submission.getId(),
                        submission.getCreatedAt()
                ));
            }
        }

        // 5. Сортувати список: спочатку за спаданням score, потім за зростанням дати
        leaderboardEntries.sort(Comparator
                .comparing(LeaderboardEntryDto::getScore).reversed()
                .thenComparing(LeaderboardEntryDto::getSubmittedAt)
        );

        // 6. Призначити фінальні ранги
        for (int i = 0; i < leaderboardEntries.size(); i++) {
            leaderboardEntries.get(i).setRank(i + 1);
        }

        return leaderboardEntries;
    }
}