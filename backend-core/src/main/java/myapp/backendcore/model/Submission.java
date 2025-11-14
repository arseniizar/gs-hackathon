package myapp.backendcore.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "submissions")
public class Submission {

    @Id
    private String id;

    private String userId;
    private String challengeId;

    private String filename;          // stored filename on disk
    private String originalFilename;

    private long fileSize;

    private SubmissionStatus status;

    private Double score;             // null until processed
    private String errorMessage;

    private String submissionHash;    // SHA1 for duplicate detection

    private Instant createdAt;
    private Instant updatedAt;
}