package myapp.backendcore;

import com.fasterxml.jackson.databind.ObjectMapper;
import myapp.backendcore.dto.LoginRequest;
import myapp.backendcore.dto.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = "spring.config.name=application-test")
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

    @Test
    void testRegisterAndLogin() throws Exception {

        RegisterRequest reg = new RegisterRequest();
        reg.setEmail("user@test.com");
        reg.setPassword("123456");
        reg.setDisplayName("Test User");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest();
        login.setEmail("user@test.com");
        login.setPassword("123456");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(mapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists());
    }
}