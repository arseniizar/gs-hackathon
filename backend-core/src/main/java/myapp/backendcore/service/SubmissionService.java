package myapp.backendcore.service;

import myapp.backendcore.dto.SubmissionResultDto;
import myapp.backendcore.model.Submission;
import myapp.backendcore.model.SubmissionStatus;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.io.InputStream;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Comparator;
import java.util.Optional;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Value("${hackathon.storage.upload-dir}")
    private String uploadDir;

    @Value("${worker.secret}")
    private String workerSecret;

    @Value("${worker.api.url}")
    private String workerApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public SubmissionService(SubmissionRepository submissionRepository, UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
    }

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

    public Resource getSubmissionFile(String submissionId) throws Exception {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        Path filePath = Paths.get(uploadDir).resolve(submission.getFilename());
        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("File not found");
        }

        return new UrlResource(filePath.toUri());
    }

    public void processAndSendSubmission(String submissionId) throws Exception {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        Path filePath = Paths.get(uploadDir).resolve(submission.getFilename());
        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("File not found");
        }

        // Read the file content
        String fileContent = Files.readString(filePath, StandardCharsets.UTF_8);

        // Append WORKER_SECRET to the file content
        String updatedContent = fileContent + "\n\nWORKER_SECRET=" + workerSecret;

        // Write the updated content to a temporary file
        Path tempFilePath = Paths.get(uploadDir).resolve("temp-" + submission.getFilename());
        Files.writeString(tempFilePath, updatedContent, StandardCharsets.UTF_8);

        // Send the file via REST
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(Files.readAllBytes(tempFilePath), headers);

        try {
            restTemplate.postForEntity(workerApiUrl + "/process-file", requestEntity, String.class);
        } finally {
            // Clean up the temporary file
            Files.deleteIfExists(tempFilePath);
        }
    }

    public double evaluateSubmission(String submissionId) throws Exception {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found"));

        Path filePath = Paths.get(uploadDir).resolve(submission.getFilename());
        if (!Files.exists(filePath)) {
            throw new IllegalArgumentException("File not found");
        }

        // Send the file to the worker for scoring
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(Files.readAllBytes(filePath), headers);

        ResponseEntity<Double> response = restTemplate.postForEntity(
                workerApiUrl + "/score-file",
                requestEntity,
                Double.class
        );

        double score = response.getBody();

        // Update the submission with the score
        submission.setScore(score);
        submission.setStatus(SubmissionStatus.DONE);
        submission.setUpdatedAt(Instant.now());
        submissionRepository.save(submission);

        return score;
    }

    public void applyWorkerResult(String submissionId, SubmissionResultDto body) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + submissionId));

        String status = body.getStatus();
        if ("DONE".equalsIgnoreCase(status)) {
            submission.setStatus(SubmissionStatus.DONE);
            submission.setScore(body.getScore());
        } else if ("FAILED".equalsIgnoreCase(status)) {
            submission.setStatus(SubmissionStatus.FAILED);
            submission.setErrorMessage(body.getErrorMessage());
        } else {
            throw new IllegalArgumentException("Unknown worker status: " + status);
        }

        // Store worker metadata
        submission.setWorkerHash(body.getHash());
        submission.setPlagiarism(Boolean.TRUE.equals(body.getPlagiarism()));
        submission.setWorkerTotalRows(body.getTotalRows());

        if (body.getTimestamp() != null) {
            submission.setWorkerScoredAt(Instant.ofEpochMilli(body.getTimestamp()));
        } else {
            submission.setWorkerScoredAt(Instant.now());
        }

        submission.setUpdatedAt(Instant.now());
        submissionRepository.save(submission);
    }
}
