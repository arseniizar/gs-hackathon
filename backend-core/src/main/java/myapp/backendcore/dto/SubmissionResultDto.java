package myapp.backendcore.dto;

import lombok.Data;

@Data
public class SubmissionResultDto {
    private String status;       // "DONE" or "FAILED"
    private Double score;        // may be null on FAILED
    private String errorMessage; // for FAILED
    private String hash;         // worker hash
    private Boolean plagiarism;  // true if duplicate hash
    private Integer totalRows;   // rows used in scoring
    private Long timestamp;      // worker timestamp (epoch millis)
}



