package myapp.backendcore.controller;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.dto.SubmissionResultDto;
import myapp.backendcore.model.Submission;
import myapp.backendcore.model.SubmissionStatus;
import myapp.backendcore.service.SubmissionService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal/submissions")
@RequiredArgsConstructor
public class InternalSubmissionController {

    private final SubmissionService submissionService;

    // Worker picks next submission
    @GetMapping("/next")
    public ResponseEntity<?> getNextPendingSubmission() {

        var pendingOpt = submissionService.fetchNextPending();

        if (pendingOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // nothing to process
        }

        Submission s = submissionService.markAsProcessing(pendingOpt.get());
        return ResponseEntity.ok(s);
    }

    // Worker sends back final score
    @PostMapping("/{id}/result")
    public ResponseEntity<?> postResult(
            @PathVariable String id,
            @RequestBody SubmissionResultDto dto
    ) {
        try {
            SubmissionStatus status;

            if ("DONE".equalsIgnoreCase(dto.getStatus())) {
                status = SubmissionStatus.DONE;
            } else {
                status = SubmissionStatus.FAILED;
            }

            Submission updated = submissionService.updateSubmissionResult(
                    id,
                    status,
                    dto.getScore(),
                    dto.getErrorMessage()
            );

            return ResponseEntity.ok(updated);

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}