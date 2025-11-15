package myapp.backendcore.controller;

import myapp.backendcore.dto.SubmissionResultDto;
import myapp.backendcore.model.Submission;
import myapp.backendcore.repository.UserRepository;
import myapp.backendcore.service.SubmissionService;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class SubmissionController {

    private final SubmissionService submissionService;
    private final UserRepository userRepository;

    public SubmissionController(SubmissionService submissionService, UserRepository userRepository) {
        this.submissionService = submissionService;
        this.userRepository = userRepository;
    }

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

            return ResponseEntity.ok()
                    .body("Submission scored successfully. Score: " + score);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error occurred while scoring the submission");
        }
    }
}
