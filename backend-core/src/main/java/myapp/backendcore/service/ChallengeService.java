package myapp.backendcore.service;

import lombok.RequiredArgsConstructor;
import myapp.backendcore.dto.ChallengeCreateRequest;
import myapp.backendcore.dto.ChallengeResponse;
import myapp.backendcore.dto.ChallengeUpdateRequest;
import myapp.backendcore.exception.ResourceNotFoundException;
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

    // ─────────────────────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────────────────────
    public ChallengeResponse create(ChallengeCreateRequest req) {

        Challenge challenge = Challenge.builder()
                .title(req.getTitle())
                .description(req.getDescription())
                .metric(req.getMetric())
                .status(ChallengeStatus.OPEN)     // always OPEN on create
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        return toResponse(challengeRepository.save(challenge));
    }

    // ─────────────────────────────────────────────────────────────
    // UPDATE
    // ─────────────────────────────────────────────────────────────
    public ChallengeResponse update(String id, ChallengeUpdateRequest req) {

        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));

        // Update BASIC fields
        challenge.setTitle(req.getTitle());
        challenge.setDescription(req.getDescription());
        challenge.setMetric(req.getMetric());

        // Validate and update STATUS
        try {
            ChallengeStatus newStatus =
                    ChallengeStatus.valueOf(req.getStatus().trim().toUpperCase());

            challenge.setStatus(newStatus);

        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid status: " + req.getStatus());
        }

        challenge.setUpdatedAt(Instant.now());

        return toResponse(challengeRepository.save(challenge));
    }

    // ─────────────────────────────────────────────────────────────
    // GET BY ID
    // ─────────────────────────────────────────────────────────────
    public ChallengeResponse getById(String id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));

        return toResponse(challenge);
    }

    // ─────────────────────────────────────────────────────────────
    // GET ALL
    // ─────────────────────────────────────────────────────────────
    public List<ChallengeResponse> getAll() {
        return challengeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE
    // ─────────────────────────────────────────────────────────────
    public void delete(String id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));

        challengeRepository.delete(challenge);
    }

    // ─────────────────────────────────────────────────────────────
    // MAPPING
    // ─────────────────────────────────────────────────────────────
    private ChallengeResponse toResponse(Challenge challenge) {
        return ChallengeResponse.builder()
                .id(challenge.getId())
                .title(challenge.getTitle())
                .description(challenge.getDescription())
                .metric(challenge.getMetric())
                .status(challenge.getStatus())
                .deadline(challenge.getDeadline())
                .rules(challenge.getRules()) // 👈
                .dataAssets(challenge.getDataAssets()) // 👈
                .createdAt(challenge.getCreatedAt())
                .updatedAt(challenge.getUpdatedAt())
                .build();
    }
}