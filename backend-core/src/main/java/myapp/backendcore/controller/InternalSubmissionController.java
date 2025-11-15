package myapp.backendcore.controller;

import myapp.backendcore.dto.SubmissionResultDto;
import myapp.backendcore.dto.WorkerSubmissionDto;
import myapp.backendcore.service.SubmissionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/internal/submissions")
public class InternalSubmissionController {

    private static final Logger log = LoggerFactory.getLogger(InternalSubmissionController.class);
    private final SubmissionService submissionService;

    @Value("${worker.secret}")
    private String workerSecret;

    public InternalSubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    @GetMapping("/next")
    public ResponseEntity<?> getNextPendingSubmission(@RequestHeader("X-WORKER-TOKEN") String workerHeaderSecret) {
        log.info("✅ Worker requested next task. Verifying token...");

        if (!workerSecret.equals(workerHeaderSecret)) {
            log.warn("❌ FORBIDDEN: Worker token is INVALID.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        log.info("   Token is valid. Fetching next task from service.");
        Optional<WorkerSubmissionDto> nextTask = submissionService.fetchNextPendingTask();

        if (nextTask.isPresent()) {
            log.info("   -> Found task: {}", nextTask.get().getId());
            return ResponseEntity.ok(nextTask.get());
        } else {
            log.info("   -> No pending tasks found.");
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{id}/result")
    public ResponseEntity<Void> handleWorkerResult(
            @PathVariable String id,
            @RequestBody SubmissionResultDto body,
            @RequestHeader("X-WORKER-TOKEN") String workerHeaderSecret
    ) {
        log.info("✅ Worker returned result for submission: {}. Verifying token...", id);

        if (!workerSecret.equals(workerHeaderSecret)) {
            log.warn("❌ FORBIDDEN: Worker token is INVALID.");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        log.info("   Token is valid. Applying result...");
        submissionService.applyWorkerResult(id, body);
        log.info("   Result for {} applied successfully.", id);

        return ResponseEntity.noContent().build();
    }
}