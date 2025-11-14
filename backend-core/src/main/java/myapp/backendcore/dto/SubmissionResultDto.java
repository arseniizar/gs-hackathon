package myapp.backendcore.dto;

import lombok.Data;

@Data
public class SubmissionResultDto {
    private String status;       // "DONE" or "FAILED"
    private Double score;        // may be null if failed
    private String errorMessage; // worker error or null
}