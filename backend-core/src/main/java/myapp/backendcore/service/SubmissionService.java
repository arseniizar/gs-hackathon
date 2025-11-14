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
}