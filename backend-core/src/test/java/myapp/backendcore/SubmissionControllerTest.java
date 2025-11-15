package myapp.backendcore;
import com.fasterxml.jackson.databind.ObjectMapper;
import myapp.backendcore.dto.LoginRequest;
import myapp.backendcore.dto.RegisterRequest;
import myapp.backendcore.repository.SubmissionRepository;
import myapp.backendcore.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.config.name=application-test")
@AutoConfigureMockMvc
public class SubmissionControllerTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper mapper;
    @Autowired private UserRepository userRepository;
    @Autowired private SubmissionRepository submissionRepository;

    @BeforeEach
    void cleanDb() {
        submissionRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void testSubmissionFlow() throws Exception {

        // 1. Register a user
        RegisterRequest req = new RegisterRequest();
        req.setEmail("test@a.com");
        req.setPassword("123456");
        req.setDisplayName("Tester");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(req)))
                .andExpect(status().isCreated());

        // 2. Login and extract token
        LoginRequest login = new LoginRequest();
        login.setEmail("test@a.com");
        login.setPassword("123456");

        String loginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        String token = mapper.readTree(loginResponse).get("token").asText();

        // 3. Create a mock file
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "submission.csv",
                "text/csv",
                "hello,world".getBytes()
        );

        // 4. Submit
        mockMvc.perform(multipart("/api/submit")
                        .file(mockFile)
                        .param("challengeId", "12345")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated()); // <--- This will now pass
    }
}