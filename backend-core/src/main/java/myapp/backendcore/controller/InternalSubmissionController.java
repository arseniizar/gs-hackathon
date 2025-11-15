package myapp.backendcore.controller;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.dto.SubmissionResultDto;
import myapp.backendcore.service.SubmissionService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/internal/submissions")
@RequiredArgsConstructor
public class InternalSubmissionController {

    private final SubmissionService submissionService;

    @Value("${worker.secret}")
    private String workerSecret;

    @PostMapping("/{id}/result")
    public ResponseEntity<Void> handleWorkerResult(
            @PathVariable String id,
            @RequestBody SubmissionResultDto body,
            @RequestHeader("X-Worker") String workerHeaderSecret
    ) {
        if (!workerSecret.equals(workerHeaderSecret)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        submissionService.applyWorkerResult(id, body);
        return ResponseEntity.noContent().build();
    }
}
