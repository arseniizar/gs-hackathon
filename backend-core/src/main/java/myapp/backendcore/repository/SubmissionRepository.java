package myapp.backendcore.repository;

import myapp.backendcore.model.Submission;
import myapp.backendcore.model.SubmissionStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubmissionRepository extends MongoRepository<Submission, String> {
    List<Submission> findByStatus(SubmissionStatus status);
    boolean existsBySubmissionHash(String submissionHash);
    List<Submission> findByChallengeIdAndStatus(String challengeId, SubmissionStatus status);
}