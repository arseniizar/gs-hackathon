// Файл: backend-core/src/main/java/myapp/backendcore/model/Challenge.java
package myapp.backendcore.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "challenges")
public class Challenge {

    @Id
    private String id;
    private String title;
    private String description;
    private ChallengeStatus status = ChallengeStatus.OPEN;
    private String metric;
    private Instant deadline;

    private String rules; // 👈 Нове поле
    private List<DataAsset> dataAssets; // 👈 Нове поле

    private Instant createdAt;
    private Instant updatedAt;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class DataAsset {
        private String name;
        private String size; // e.g. "15 MB"
    }
}