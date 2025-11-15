package myapp.backendcore;

import myapp.backendcore.controller.InternalSubmissionController;
import myapp.backendcore.dto.SubmissionResultDto;
import myapp.backendcore.service.SubmissionService;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class InternalSubmissionControllerUnitTest {

    @Test
    void acceptsRequestWhenXWorkerIsCorrect() {
        SubmissionService submissionService = mock(SubmissionService.class);
        InternalSubmissionController controller = new InternalSubmissionController(submissionService);

        ReflectionTestUtils.setField(controller, "workerSecret", "k3G9s8FaP1qX7Zb2Rm4U8tN5cQ0L9Hw6");

        SubmissionResultDto dto = new SubmissionResultDto();
        dto.setStatus("DONE");
        dto.setScore(0.9);

        ResponseEntity<Void> response =
                controller.handleWorkerResult("abc123", dto, "k3G9s8FaP1qX7Zb2Rm4U8tN5cQ0L9Hw6");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(submissionService).applyWorkerResult(eq("abc123"), any(SubmissionResultDto.class));
    }

    @Test
    void rejectsRequestWhenXWorkerIsWrong() {
        SubmissionService submissionService = mock(SubmissionService.class);
        InternalSubmissionController controller = new InternalSubmissionController(submissionService);

        ReflectionTestUtils.setField(controller, "workerSecret", "k3G9s8FaP1qX7Zb2Rm4U8tN5cQ0L9Hw6");

        SubmissionResultDto dto = new SubmissionResultDto();
        dto.setStatus("DONE");
        dto.setScore(0.9);

        ResponseEntity<Void> response =
                controller.handleWorkerResult("abc123", dto, "wrong-secret");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.FORBIDDEN);
        verify(submissionService, never()).applyWorkerResult(any(), any());
    }
}