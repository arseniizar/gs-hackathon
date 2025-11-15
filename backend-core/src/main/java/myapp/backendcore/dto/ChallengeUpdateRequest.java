package myapp.backendcore.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class ChallengeUpdateRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 120, message = "Title must be between 3 and 120 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, message = "Description must be at least 10 characters")
    private String description;

    @NotBlank(message = "Status is required")
    private String status;

    @NotBlank(message = "Metric is required")
    private String metric;

    private String deadlineUtc;
}