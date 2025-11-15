package myapp.backendcore.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Логуємо тільки запити до /api/
        if (request.getRequestURI().startsWith("/api/")) {
            log.info("▶️ INCOMING REQUEST: {} {}", request.getMethod(), request.getRequestURI());

            // Логуємо важливі заголовки
            String workerToken = request.getHeader("X-WORKER-TOKEN");
            String authHeader = request.getHeader("Authorization");

            if (workerToken != null) {
                log.info("   -> Header X-WORKER-TOKEN: [PRESENT]");
            }
            if (authHeader != null) {
                log.info("   -> Header Authorization: [PRESENT]");
            }
        }

        filterChain.doFilter(request, response);
    }
}