package myapp.backendcore.service;

import myapp.backendcore.dto.ChallengeCreateRequest;
import myapp.backendcore.dto.ChallengeResponse;
import myapp.backendcore.dto.ChallengeSaveRequest;
import myapp.backendcore.dto.ChallengeUpdateRequest;
import myapp.backendcore.exception.ResourceNotFoundException;
import myapp.backendcore.model.Challenge;
import myapp.backendcore.model.ChallengeStatus;
import myapp.backendcore.repository.ChallengeRepository;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.util.List;

@Service
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

    public ChallengeService(ChallengeRepository challengeRepository) {
        this.challengeRepository = challengeRepository;
    }

    // ─────────────────────────────────────────────────────────────
    // CREATE
    // ─────────────────────────────────────────────────────────────
    public ChallengeResponse create(ChallengeSaveRequest req) {
        Challenge challenge = new Challenge();
        challenge.setTitle(req.getTitle());
        challenge.setDescription(req.getDescription());
        challenge.setMetric(req.getMetric());
        challenge.setRules(req.getRules());

        // Handle deadline
        if (StringUtils.hasText(req.getDeadline())) {
            challenge.setDeadline(Instant.parse(req.getDeadline()));
        }

        challenge.setStatus(ChallengeStatus.OPEN); // Always OPEN on create
        challenge.setCreatedAt(Instant.now());
        challenge.setUpdatedAt(Instant.now());

        return toResponse(challengeRepository.save(challenge));
    }

    public ChallengeResponse update(String id, ChallengeSaveRequest req) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + id));

        challenge.setTitle(req.getTitle());
        challenge.setDescription(req.getDescription());
        challenge.setMetric(req.getMetric());
        challenge.setRules(req.getRules());

        // Handle deadline
        if (StringUtils.hasText(req.getDeadline())) {
            challenge.setDeadline(Instant.parse(req.getDeadline()));
        } else {
            challenge.setDeadline(null);
        }

        // Handle status
        if (StringUtils.hasText(req.getStatus())) {
            try {
                challenge.setStatus(ChallengeStatus.valueOf(req.getStatus().toUpperCase()));
            } catch (IllegalArgumentException e) {
                // Keep old status if new one is invalid
            }
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
