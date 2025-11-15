package myapp.backendcore;

import myapp.backendcore.dto.ChallengeCreateRequest;
import myapp.backendcore.dto.ChallengeResponse;
import myapp.backendcore.dto.ChallengeUpdateRequest;
import myapp.backendcore.exception.ResourceNotFoundException;
import myapp.backendcore.model.Challenge;
import myapp.backendcore.model.ChallengeStatus;
import myapp.backendcore.repository.ChallengeRepository;
import myapp.backendcore.service.ChallengeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ChallengeServiceTest {

    @Mock
    private ChallengeRepository challengeRepository;

    @InjectMocks
    private ChallengeService challengeService;

    @BeforeEach
    void setUp() {
        // nothing for now
    }

    @Test
    void create_shouldSaveChallengeWithDefaultOpenStatus() {
        // given
        ChallengeCreateRequest request = new ChallengeCreateRequest();
        request.setTitle("Test Challenge");
        request.setDescription("Description");
        request.setMetric("accuracy");

        ArgumentCaptor<Challenge> challengeCaptor = ArgumentCaptor.forClass(Challenge.class);

        Challenge saved = Challenge.builder()
                .id("123")
                .title("Test Challenge")
                .description("Description")
                .metric("accuracy")
                .status(ChallengeStatus.OPEN)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(challengeRepository.save(any(Challenge.class))).thenReturn(saved);

        // when
        ChallengeResponse response = challengeService.create(request);

        // then
        verify(challengeRepository).save(challengeCaptor.capture());
        Challenge toSave = challengeCaptor.getValue();

        assertThat(toSave.getStatus()).isEqualTo(ChallengeStatus.OPEN);
        assertThat(toSave.getCreatedAt()).isNotNull();
        assertThat(toSave.getUpdatedAt()).isNotNull();

        assertThat(response.getId()).isEqualTo("123");
        assertThat(response.getStatus()).isEqualTo(ChallengeStatus.OPEN);
    }

    @Test
    void update_shouldUpdateFieldsCorrectly() {
        // given
        String id = "123";
        Challenge existing = Challenge.builder()
                .id(id)
                .title("Old title")
                .description("Old desc")
                .status(ChallengeStatus.OPEN)
                .metric("accuracy")
                .createdAt(Instant.now().minusSeconds(3600))
                .updatedAt(Instant.now().minusSeconds(3600))
                .build();

        when(challengeRepository.findById(id)).thenReturn(Optional.of(existing));

        ChallengeUpdateRequest request = new ChallengeUpdateRequest();
        request.setTitle("New title");
        request.setDescription("New desc");
        request.setMetric("rmse");
        request.setStatus("CLOSED");

        when(challengeRepository.save(any(Challenge.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        // when
        ChallengeResponse response = challengeService.update(id, request);

        // then
        assertThat(response.getTitle()).isEqualTo("New title");
        assertThat(response.getDescription()).isEqualTo("New desc");
        assertThat(response.getMetric()).isEqualTo("rmse");
        assertThat(response.getStatus()).isEqualTo(ChallengeStatus.CLOSED);
        assertThat(response.getUpdatedAt()).isNotNull();

        verify(challengeRepository).save(any(Challenge.class));
    }

    @Test
    void getById_shouldThrow_WhenNotFound() {
        String id = "missing";
        when(challengeRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> challengeService.getById(id))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void getAll_shouldReturnMappedResponses() {
        Challenge c1 = Challenge.builder()
                .id("1")
                .title("C1")
                .description("D1")
                .metric("acc")
                .status(ChallengeStatus.OPEN)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        Challenge c2 = Challenge.builder()
                .id("2")
                .title("C2")
                .description("D2")
                .metric("rmse")
                .status(ChallengeStatus.CLOSED)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        when(challengeRepository.findAll()).thenReturn(List.of(c1, c2));

        List<ChallengeResponse> responses = challengeService.getAll();

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getId()).isEqualTo("1");
        assertThat(responses.get(1).getId()).isEqualTo("2");
    }

    @Test
    void delete_shouldThrow_WhenNotFound() {
        String id = "missing";
        when(challengeRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> challengeService.delete(id))
                .isInstanceOf(ResourceNotFoundException.class);

        verify(challengeRepository, never()).delete(any());
    }

    @Test
    void delete_shouldDelete_WhenExists() {
        String id = "123";
        Challenge existing = Challenge.builder().id(id).build();
        when(challengeRepository.findById(id)).thenReturn(Optional.of(existing));

        challengeService.delete(id);

        verify(challengeRepository).delete(existing);
    }
}