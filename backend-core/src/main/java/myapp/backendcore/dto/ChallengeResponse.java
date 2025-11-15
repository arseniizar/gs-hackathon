// Файл: backend-core/src/main/java/myapp/backendcore/dto/ChallengeResponse.java
package myapp.backendcore.dto;

import myapp.backendcore.model.Challenge; // Import inner class
import myapp.backendcore.model.ChallengeStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeResponse {
    private String id;
    private String title;
    private String description;
    private ChallengeStatus status;
    private String metric;
    private Instant deadline;
    private String rules; // 👈
    private List<Challenge.DataAsset> dataAssets; // 👈
    private Instant createdAt;
    private Instant updatedAt;
}