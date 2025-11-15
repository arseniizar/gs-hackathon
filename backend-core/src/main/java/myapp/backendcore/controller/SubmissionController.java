package myapp.backendcore.controller;

import myapp.backendcore.exception.ResourceNotFoundException;
import myapp.backendcore.model.Submission;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import myapp.backendcore.service.SubmissionService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    public SubmissionController(
            SubmissionService submissionService,
            UserRepository userRepository,
            SubmissionRepository submissionRepository
    ) {
        this.submissionService = submissionService;
        this.userRepository = userRepository;
        this.submissionRepository = submissionRepository;
    }

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submit(
            @RequestParam("challengeId") String challengeId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            if (file.isEmpty() || !file.getOriginalFilename().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("Invalid file. Only CSV files are allowed.");
            }

            String userEmail = authentication.getName();
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Submission submission = submissionService.createSubmission(
                    user.getId(),
                    challengeId,
                    file
            );

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(submission);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error during submission");
        }
    }

    @GetMapping("/submissions/my")
    public ResponseEntity<List<Submission>> getMySubmissions(
            @RequestParam("challengeId") String challengeId,
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Submission> subs = submissionRepository.findByUserIdAndChallengeId(user.getId(), challengeId);
        subs.sort((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()));

        return ResponseEntity.ok(subs);
    }

    @GetMapping("/submission/{id}/file")
    public ResponseEntity<?> getSubmissionFile(@PathVariable("id") String submissionId) {
        try {
            var fileResource = submissionService.getSubmissionFile(submissionId);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileResource.getFilename() + "\"")
                    .body(fileResource);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error");
        }
    }

    @PostMapping("/submission/{id}/score")
    public ResponseEntity<?> scoreSubmission(@PathVariable("id") String submissionId) {
        try {
            double score = submissionService.evaluateSubmission(submissionId);

            return ResponseEntity.ok().body("Submission scored successfully. Score: " + score);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred while scoring the submission");
        }
    }

    @GetMapping("/download-ground-truth")
    public ResponseEntity<?> downloadGroundTruth(@RequestParam("submissionId") Long submissionId) {
        if (submissionId <= 0) {
            return ResponseEntity.badRequest().body("Invalid submission ID.");
        }
        return ResponseEntity.ok("Ground truth downloaded successfully.");
    }

    @GetMapping("/submissions/{id}")
    public ResponseEntity<Submission> getSubmissionDetails(@PathVariable String id, Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        if (!submission.getUserId().equals(user.getId()) &&
                !authentication.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return ResponseEntity.ok(submission);
    }
}
