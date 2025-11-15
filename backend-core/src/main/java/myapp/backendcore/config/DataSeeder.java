package myapp.backendcore.config;

import myapp.backendcore.model.*;
import myapp.backendcore.repository.ChallengeRepository;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Configuration
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;
    private final SubmissionRepository submissionRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataSeeder(UserRepository userRepository,
                      ChallengeRepository challengeRepository,
                      SubmissionRepository submissionRepository) {
        this.userRepository = userRepository;
        this.challengeRepository = challengeRepository;
        this.submissionRepository = submissionRepository;
    }

    @Override
    public void run(String... args) {
        log.info("🔄 DataSeeder: Re-seeding database...");
        submissionRepository.deleteAll();
        challengeRepository.deleteAll();
        userRepository.deleteAll();

        List<User> users = seedUsers();
        List<Challenge> challenges = seedChallenges();
        seedSubmissions(users, challenges);

        log.info("✅ DataSeeder completed.");
    }

    private List<User> seedUsers() {
        List<User> users = new ArrayList<>();

        users.add(userRepository.save(User.builder()
                .email("admin@hack.com").passwordHash(passwordEncoder.encode("admin123"))
                .teamName("Admin Team").roles(Set.of("ROLE_USER", "ROLE_ADMIN")).build()));

        users.add(userRepository.save(User.builder().email("team1@hack.com").passwordHash(passwordEncoder.encode("123456")).teamName("Quantum Solvers").roles(Set.of("ROLE_USER")).build()));
        users.add(userRepository.save(User.builder().email("team2@hack.com").passwordHash(passwordEncoder.encode("123456")).teamName("Neural Ninjas").roles(Set.of("ROLE_USER")).build()));
        users.add(userRepository.save(User.builder().email("team3@hack.com").passwordHash(passwordEncoder.encode("123456")).teamName("Data Miners").roles(Set.of("ROLE_USER")).build()));
        users.add(userRepository.save(User.builder().email("team4@hack.com").passwordHash(passwordEncoder.encode("123456")).teamName("Gradient Descenters").roles(Set.of("ROLE_USER")).build()));

        return users;
    }

    private List<Challenge> seedChallenges() {
        List<Challenge> challenges = new ArrayList<>();

        challenges.add(challengeRepository.save(Challenge.builder()
                .title("Titanic Survival Prediction")
                .description("Predict survival on the Titanic using passenger data. This is a classic binary classification problem. Optimize for Accuracy.")
                .rules("1. No external data allowed.\n2. Max 5 submissions per day.\n3. Team merging is allowed until 1 week before deadline.")
                .metric("Accuracy")
                .status(ChallengeStatus.OPEN)
                .deadline(Instant.now().plus(10, ChronoUnit.DAYS))
                .dataAssets(List.of(new Challenge.DataAsset("train.csv", "56 KB"), new Challenge.DataAsset("test.csv", "28 KB"), new Challenge.DataAsset("sample_submission.csv", "2 KB")))
                .createdAt(Instant.now().minus(5, ChronoUnit.DAYS))
                .updatedAt(Instant.now())
                .build()));

        challenges.add(challengeRepository.save(Challenge.builder()
                .title("Stock Market Volatility")
                .description("Forecast the volatility of a set of major stocks over the next 10-minute window. High frequency data provided.")
                .rules("Standard competition rules apply. RMSE is the evaluation metric.")
                .metric("RMSE")
                .status(ChallengeStatus.OPEN)
                .deadline(Instant.now().plus(20, ChronoUnit.DAYS))
                .dataAssets(List.of(new Challenge.DataAsset("market_data.parquet", "120 MB"), new Challenge.DataAsset("targets.csv", "5 MB")))
                .createdAt(Instant.now().minus(2, ChronoUnit.DAYS))
                .updatedAt(Instant.now())
                .build()));

        challenges.add(challengeRepository.save(Challenge.builder()
                .title("House Price Regression")
                .description("Predict sales prices and practice feature engineering, RFs, and gradient boosting.")
                .rules("Competition is CLOSED.")
                .metric("RMSE")
                .status(ChallengeStatus.CLOSED)
                .deadline(Instant.now().minus(2, ChronoUnit.DAYS))
                .dataAssets(List.of(new Challenge.DataAsset("houses_train.csv", "400 KB")))
                .createdAt(Instant.now().minus(30, ChronoUnit.DAYS))
                .updatedAt(Instant.now().minus(2, ChronoUnit.DAYS))
                .build()));

        challenges.add(challengeRepository.save(Challenge.builder()
                .title("Sentiment Analysis on Tweets")
                .description("Classify tweets into positive, negative, or neutral sentiment.")
                .rules("Use of pre-trained models like BERT is allowed.")
                .metric("F1-Score")
                .status(ChallengeStatus.OPEN)
                .deadline(Instant.now().plus(5, ChronoUnit.DAYS))
                .dataAssets(List.of(new Challenge.DataAsset("tweets.jsonl", "45 MB")))
                .createdAt(Instant.now().minus(10, ChronoUnit.DAYS))
                .updatedAt(Instant.now())
                .build()));

        challenges.add(challengeRepository.save(Challenge.builder()
                .title("Image Classification: Wildfire Detection")
                .description("Detect wildfires from satellite imagery.")
                .rules("TBD")
                .metric("ROC-AUC")
                .status(ChallengeStatus.OPEN)
                .deadline(Instant.now().plus(45, ChronoUnit.DAYS))
                .dataAssets(List.of(new Challenge.DataAsset("images.zip", "1.2 GB")))
                .createdAt(Instant.now().minus(1, ChronoUnit.DAYS))
                .updatedAt(Instant.now())
                .build()));

        return challenges;
    }

    private void seedSubmissions(List<User> users, List<Challenge> challenges) {
        Random rand = new Random();
        User admin = users.get(0);
        for (Challenge c : challenges) {
            int adminSubs = rand.nextInt(3) + 2;
            for (int i = 0; i < adminSubs; i++) {
                createSubmission(admin, c, rand);
            }
            for (int i = 1; i < users.size(); i++) {
                if (rand.nextBoolean()) {
                    int count = rand.nextInt(3) + 1;
                    for (int j = 0; j < count; j++) {
                        createSubmission(users.get(i), c, rand);
                    }
                }
            }
        }
    }

    private void createSubmission(User user, Challenge c, Random rand) {
        SubmissionStatus status = SubmissionStatus.DONE;
        Double score = 0.5 + (rand.nextDouble() * 0.45);
        if (c.getStatus() == ChallengeStatus.OPEN && rand.nextInt(10) > 8) {
            status = SubmissionStatus.FAILED;
            score = null;
        }
        Submission s = Submission.builder()
                .userId(user.getId())
                .challengeId(c.getId())
                .filename("sub_" + UUID.randomUUID().toString().substring(0, 8) + ".csv")
                .originalFilename("solution.csv")
                .fileSize(1024 + rand.nextInt(10000))
                .status(status)
                .score(score)
                .submissionHash(UUID.randomUUID().toString())
                .createdAt(c.getCreatedAt().plus(rand.nextInt(48), ChronoUnit.HOURS))
                .updatedAt(Instant.now())
                .build();
        if (status == SubmissionStatus.FAILED) {
            s.setErrorMessage("Column 'prediction' not found.");
        }
        submissionRepository.save(s);
    }
}
