package myapp.backendcore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// Renamed from ChallengeUpdateRequest to be more generic
public class ChallengeSaveRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotBlank(message = "Metric is required")
    private String metric;

    // Status is now optional, we will handle default on the service layer
    private String status;

    private String rules;

    private String deadline; // Keep as String for flexibility

    // Getters and Setters for all fields...
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getMetric() { return metric; }
    public void setMetric(String metric) { this.metric = metric; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getRules() { return rules; }
    public void setRules(String rules) { this.rules = rules; }
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
}