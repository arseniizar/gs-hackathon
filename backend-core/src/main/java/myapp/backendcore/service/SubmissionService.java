package myapp.backendcore.service;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.model.Submission;
import myapp.backendcore.model.SubmissionStatus;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.*;
import java.time.Instant;
import java.util.Comparator;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Value("${hackathon.storage.upload-dir}")
    private String uploadDir;

    public Submission createSubmission(String userId, String challengeId, MultipartFile file) throws Exception {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("File cannot be empty");
        }

        // Ensure directory exists
        Files.createDirectories(Paths.get(uploadDir));

        // Compute SHA1 (anti-cheating)
        String sha1;
        try (InputStream in = file.getInputStream()) {
            sha1 = DigestUtils.sha1Hex(in);
        }

        // Check duplicate
        if (submissionRepository.existsBySubmissionHash(sha1)) {
            throw new IllegalArgumentException("Duplicate submission detected");
        }

        // Store file with safe name
        String storedName = Instant.now().toEpochMilli() + "-" +
                file.getOriginalFilename().replaceAll("\\s+", "_");

        Path dest = Paths.get(uploadDir).resolve(storedName);

        try (InputStream in = file.getInputStream()) {
            Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
        }

        Submission submission = Submission.builder()
                .userId(userId)
                .challengeId(challengeId)
                .filename(storedName)
                .originalFilename(file.getOriginalFilename())
                .fileSize(file.getSize())
                .status(SubmissionStatus.PENDING)
                .submissionHash(sha1)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return submissionRepository.save(submission);
    }

    public Optional<Submission> fetchNextPending() {
        return submissionRepository.findByStatus(SubmissionStatus.PENDING)
                .stream()
                .sorted(Comparator.comparing(Submission::getCreatedAt))
                .findFirst();
    }

    public Submission markAsProcessing(Submission s) {
        s.setStatus(SubmissionStatus.PROCESSING);
        s.setUpdatedAt(Instant.now());
        return submissionRepository.save(s);
    }

    public Submission updateSubmissionResult(String id, SubmissionStatus status, Double score, String errorMessage) {
        Submission s = submissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        s.setStatus(status);
        s.setScore(score);
        s.setErrorMessage(errorMessage);
        s.setUpdatedAt(Instant.now());

        return submissionRepository.save(s);
    }
}