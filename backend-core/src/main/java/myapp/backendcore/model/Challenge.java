package myapp.backendcore.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

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
    private Instant createdAt;
    private Instant updatedAt;

}


//🔍 Why “Document” and not “Entity”?
//        •	In MongoDB, the term is document, not entity.
//        •	MongoDB stores data as BSON documents (similar to JSON).
//        •	Spring Boot maps a “document” class to a MongoDB collection.
//
//So:
//        •	In SQL → you have entities, tables
//	•	In Mongo → you have documents, collections
