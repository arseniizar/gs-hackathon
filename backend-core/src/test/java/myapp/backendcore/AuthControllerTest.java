package myapp.backendcore;

import com.fasterxml.jackson.databind.ObjectMapper;
import myapp.backendcore.dto.LoginRequest;
import myapp.backendcore.dto.RegisterRequest;
import myapp.backendcore.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.config.name=application-test")
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDb() {
        userRepository.deleteAll();
    }

    @Test
    void testFirstUserIsAdmin_andSecondIsUser() throws Exception {

        // REGISTER FIRST USER → SHOULD BE ADMIN
        RegisterRequest reg1 = new RegisterRequest();
        reg1.setEmail("first@test.com");
        reg1.setPassword("pass123");
        reg1.setDisplayName("First User");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(reg1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.roles", hasSize(2)))
                .andExpect(jsonPath("$.roles", containsInAnyOrder("ROLE_USER", "ROLE_ADMIN")));

        // REGISTER SECOND USER → SHOULD BE NORMAL USER
        RegisterRequest reg2 = new RegisterRequest();
        reg2.setEmail("second@test.com");
        reg2.setPassword("pass123");
        reg2.setDisplayName("Second User");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(reg2)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.roles", hasSize(1)))
                .andExpect(jsonPath("$.roles[0]").value("ROLE_USER"));

        // LOGIN second user → expect token
        LoginRequest login = new LoginRequest();
        login.setEmail("second@test.com");
        login.setPassword("pass123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}