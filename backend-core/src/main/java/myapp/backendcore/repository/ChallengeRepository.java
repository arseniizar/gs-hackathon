package myapp.backendcore.repository;

import myapp.backendcore.model.Challenge;
import myapp.backendcore.model.ChallengeStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findByStatus(ChallengeStatus status);
}
