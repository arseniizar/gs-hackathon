package myapp.backendcore.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import myapp.backendcore.model.ChallengeStatus;

import java.util.Optional;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChallengeCreateRequest {

    @NotBlank
    private String title;

    @Size(max = 2000)
    private String description;

    private Optional<ChallengeStatus> status;
}