package myapp.backendcore.controller;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.model.Submission;
import myapp.backendcore.repository.UserRepository;
import myapp.backendcore.service.SubmissionService;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserRepository userRepository;

    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submit(
            @RequestParam("challengeId") String challengeId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) {
        try {
            String userEmail = authentication.getName();

            var user = userRepository.findByEmail(userEmail).orElseThrow();

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
                    .body("Unexpected error");
        }
    }
}