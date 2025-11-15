package myapp.backendcore.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import myapp.backendcore.model.Challenge;
import myapp.backendcore.model.ChallengeStatus;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.ChallengeRepository;
import myapp.backendcore.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Set;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ChallengeRepository challengeRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) {

        seedAdminUser();
        seedChallenges();
    }

    private void seedAdminUser() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .email("admin@hack.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .displayName("Admin User")
                    .roles(Set.of("ROLE_USER", "ROLE_ADMIN"))
                    .build();

            userRepository.save(admin);
            log.info("🌱 Seeded Admin user: admin@hack.com / admin123");
        }
    }

    private void seedChallenges() {
        if (challengeRepository.count() == 0) {

            Challenge c1 = Challenge.builder()
                    .title("Titanic Survival Prediction")
                    .description("Predict if a passenger survived based on Titanic dataset")
                    .status(ChallengeStatus.OPEN)     // ✅ ENUM
                    .metric("accuracy")
                    .build();

            Challenge c2 = Challenge.builder()
                    .title("House Price Regression")
                    .description("Predict home prices using regression techniques")
                    .status(ChallengeStatus.OPEN)    // ✅ ENUM
                    .metric("rmse")
                    .build();

            challengeRepository.save(c1);
            challengeRepository.save(c2);

            log.info("🌱 Seeded demo challenges");
        }
    }
}