package myapp.backendcore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class TeamProfileUpdateRequest {

    @NotBlank(message = "Team name is required")
    @Size(min = 2, max = 32, message = "Team name must be between 2 and 32 characters")
    private String teamName;

    private List<String> teamMembers;

    public TeamProfileUpdateRequest() {}

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }
    public List<String> getTeamMembers() { return teamMembers; }
    public void setTeamMembers(List<String> teamMembers) { this.teamMembers = teamMembers; }
}