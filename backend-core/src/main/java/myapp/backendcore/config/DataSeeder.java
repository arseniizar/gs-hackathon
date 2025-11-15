package myapp.backendcore.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import myapp.backendcore.model.*;
import myapp.backendcore.repository.ChallengeRepository;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.util.List;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SubmissionRepository submissionRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {
        log.info("🔄 DataSeeder: Cleaning up old data...");
        resetDatabase();

        seedAdminUser();
        seedChallenges();
        seedLeaderboardDemo();

        log.info("✅ DataSeeder completed.");
    }

    // --------------------------------------------------------
    // DELETE ALL RECORDS (dev only)
    // --------------------------------------------------------
    private void resetDatabase() {
        submissionRepository.deleteAll();
        challengeRepository.deleteAll();
        userRepository.deleteAll();

        log.warn("⚠️ All collections dropped: users, challenges, submissions");
    }

    // --------------------------------------------------------
    // ADMIN USER
    // --------------------------------------------------------
    private void seedAdminUser() {

        User admin = User.builder()
                .email("admin@hack.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .displayName("Admin User")
                .roles(Set.of("ROLE_USER", "ROLE_ADMIN"))
                .build();

        userRepository.save(admin);

        log.info("🌱 Seeded Admin user: admin@hack.com / admin123");
    }

    // --------------------------------------------------------
    // CHALLENGES
    // --------------------------------------------------------
    private void seedChallenges() {

        Challenge c1 = Challenge.builder()
                .title("Titanic Survival Prediction")
                .description("Predict if a passenger survived based on Titanic dataset")
                .status(ChallengeStatus.OPEN)
                .metric("accuracy")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Challenge c2 = Challenge.builder()
                .title("House Price Regression")
                .description("Predict home prices using regression techniques")
                .status(ChallengeStatus.OPEN)
                .metric("rmse")
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        challengeRepository.save(c1);
        challengeRepository.save(c2);

        log.info("🌱 Seeded demo challenges");
    }

    // --------------------------------------------------------
    // LEADERBOARD MOCK DATA
    // --------------------------------------------------------
    private void seedLeaderboardDemo() {

        List<User> users = userRepository.findAll();
        if (users.isEmpty()) {
            log.warn("⚠️ No users found for seeding leaderboard demo.");
            return;
        }

        List<Challenge> challenges = challengeRepository.findAll();
        if (challenges.isEmpty()) {
            log.warn("⚠️ No challenges found for seeding leaderboard demo.");
            return;
        }

        User admin = users.get(0);
        Challenge titanic = challenges.get(0);

        Submission s1 = Submission.builder()
                .userId(admin.getId())
                .challengeId(titanic.getId())
                .status(SubmissionStatus.DONE)
                .score(0.91)
                .createdAt(Instant.now().minusSeconds(5000))
                .updatedAt(Instant.now().minusSeconds(5000))
                .filename("mock1.csv")
                .originalFilename("mock1.csv")
                .fileSize(100)
                .build();

        Submission s2 = Submission.builder()
                .userId(admin.getId())
                .challengeId(titanic.getId())
                .status(SubmissionStatus.DONE)
                .score(0.94)
                .createdAt(Instant.now().minusSeconds(3000))
                .updatedAt(Instant.now().minusSeconds(3000))
                .filename("mock2.csv")
                .originalFilename("mock2.csv")
                .fileSize(100)
                .build();

        Submission s3 = Submission.builder()
                .userId(admin.getId())
                .challengeId(titanic.getId())
                .status(SubmissionStatus.DONE)
                .score(0.88)
                .createdAt(Instant.now().minusSeconds(7000))
                .updatedAt(Instant.now().minusSeconds(7000))
                .filename("mock3.csv")
                .originalFilename("mock3.csv")
                .fileSize(100)
                .build();

        submissionRepository.save(s1);
        submissionRepository.save(s2);
        submissionRepository.save(s3);

        log.info("🌱 Seeded leaderboard demo submissions");
    }
}