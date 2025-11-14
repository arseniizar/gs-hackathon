package myapp.backendcore.dto;

import myapp.backendcore.model.ChallengeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeResponse {

    private String id;

    private String title;

    private String description;

    private ChallengeStatus status;

    private Instant createdAt;

    private Instant updatedAt;
}