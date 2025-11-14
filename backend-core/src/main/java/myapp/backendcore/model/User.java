package myapp.backendcore.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String email;

    private String passwordHash;

    private String displayName;

    private Set<String> roles; // e.g. ROLE_USER, ROLE_ADMIN
}