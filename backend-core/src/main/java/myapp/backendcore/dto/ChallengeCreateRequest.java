package myapp.backendcore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChallengeCreateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotBlank(message = "Metric is required")
    private String metric;

    private String deadlineUtc; // optional for now
}