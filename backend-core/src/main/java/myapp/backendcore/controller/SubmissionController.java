package myapp.backendcore.controller;

import myapp.backendcore.model.Submission;
import myapp.backendcore.model.User;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import myapp.backendcore.service.SubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserRepository userRepository;
    private final SubmissionRepository submissionRepository;

    // Явний конструктор замість Lombok
    public SubmissionController(SubmissionService submissionService, UserRepository userRepository, SubmissionRepository submissionRepository) {
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
        // Сортуємо: новіші зверху
        subs.sort(Comparator.comparing(Submission::getCreatedAt).reversed());

        return ResponseEntity.ok(subs);
    }
}