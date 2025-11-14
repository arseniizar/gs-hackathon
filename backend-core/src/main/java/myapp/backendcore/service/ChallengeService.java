package myapp.backendcore.service;

import myapp.backendcore.dto.ChallengeCreateRequest;
import myapp.backendcore.dto.ChallengeResponse;
import myapp.backendcore.dto.ChallengeUpdateRequest;
import myapp.backendcore.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import myapp.backendcore.model.Challenge;
import myapp.backendcore.model.ChallengeStatus;
import myapp.backendcore.repository.ChallengeRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

    public ChallengeResponse create(ChallengeCreateRequest request) {
        Instant now = Instant.now();

        ChallengeStatus status = request.getStatus().orElse(ChallengeStatus.OPEN);

        Challenge challenge = Challenge.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .status(status)
                .createdAt(now)
                .updatedAt(now)
                .build();

        Challenge saved = challengeRepository.save(challenge);
        return toResponse(saved);
    }

    public ChallengeResponse update(String id, ChallengeUpdateRequest request) {
        Challenge existing = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));

        // Update only non-null fields
        if (request.getTitle() != null && request.getTitle().isBlank()) {
            throw new IllegalArgumentException("Title cannot be blank");
        }
        if (request.getTitle() != null) {
            existing.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            existing.setDescription(request.getDescription());
        }
        if (request.getStatus().isPresent()) {
            existing.setStatus(request.getStatus().get());
        }

        existing.setUpdatedAt(Instant.now());

        Challenge saved = challengeRepository.save(existing);
        return toResponse(saved);
    }

    public ChallengeResponse getById(String id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));
        return toResponse(challenge);
    }

    public List<ChallengeResponse> getAll() {
        return challengeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void delete(String id) {
        Challenge existing = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));
        challengeRepository.delete(existing);
    }

    // ─────────────────────────────
    // Mapping helper
    // ─────────────────────────────
    private ChallengeResponse toResponse(Challenge challenge) {
        return ChallengeResponse.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .status(challenge.getStatus())
                .createdAt(challenge.getCreatedAt())
                .updatedAt(challenge.getUpdatedAt())
                .build();
    }
}