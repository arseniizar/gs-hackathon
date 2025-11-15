package myapp.backendcore.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Builder
@Data
public class LeaderboardEntry {
    private int rank;
    private String userDisplayName;
    private Double score;
    private String submissionId;
    private Instant submittedAt;
}