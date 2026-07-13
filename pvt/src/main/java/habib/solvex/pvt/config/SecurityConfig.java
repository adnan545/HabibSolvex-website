package habib.solvex.pvt.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authorize -> authorize
                // Allow all static resources
                .requestMatchers(
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/webjars/**",
                    "/favicon.ico"
                ).permitAll()
                
                // Allow H2 console
                .requestMatchers("/h2-console/**").permitAll()
                
                // Allow all pages - public access
                .requestMatchers(
                    "/",
                    "/about",
                    "/products/**",
                    "/manufacturing",
                    "/quality",
                    "/industries",
                    "/export",
                    "/contact",
                    "/contact/**",
                    "/api/contact/**"
                ).permitAll()
                
                // Allow all other requests
                .anyRequest().permitAll()
            )
            // Disable CSRF for H2 console and API endpoints
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/h2-console/**", "/api/**")
            )
            // Allow frames for H2 console
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable())
            );
        
        return http.build();
    }
}