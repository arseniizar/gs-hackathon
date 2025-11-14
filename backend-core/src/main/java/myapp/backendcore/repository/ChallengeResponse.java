package myapp.backendcore.repository;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import myapp.backendcore.model.ChallengeStatus;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeResponse {

    private String id;
    private String title;
    private String description;
    private ChallengeStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}