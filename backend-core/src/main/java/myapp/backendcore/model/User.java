package myapp.backendcore.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.Set;

@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String email;

    @JsonIgnore
    private String passwordHash;

    private String teamName;

    private List<String> teamMembers;

    private Set<String> roles;

    public User() {}

    public User(String id, String email, String passwordHash, String teamName, List<String> teamMembers, Set<String> roles) {
        this.id = id;
        this.email = email;
        this.passwordHash = passwordHash;
        this.teamName = teamName;
        this.teamMembers = teamMembers;
        this.roles = roles;
    }

    public static Builder builder() {
        return new Builder();
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public List<String> getTeamMembers() { return teamMembers; }
    public void setTeamMembers(List<String> teamMembers) { this.teamMembers = teamMembers; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }

    public static final class Builder {
        private String id;
        private String email;
        private String passwordHash;
        private String teamName;
        private List<String> teamMembers;
        private Set<String> roles;

        private Builder() {}

        public Builder id(String id) { this.id = id; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder passwordHash(String passwordHash) { this.passwordHash = passwordHash; return this; }
        public Builder teamName(String teamName) { this.teamName = teamName; return this; }
        public Builder teamMembers(List<String> teamMembers) { this.teamMembers = teamMembers; return this; }
        public Builder roles(Set<String> roles) { this.roles = roles; return this; }

        public User build() {
            return new User(id, email, passwordHash, teamName, teamMembers, roles);
        }
    }
}