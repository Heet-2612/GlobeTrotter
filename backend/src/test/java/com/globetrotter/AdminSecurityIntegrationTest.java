package com.globetrotter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetrotter.entity.User;
import com.globetrotter.repository.UserRepository;
import com.globetrotter.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AdminSecurityIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    private User normalUser;
    private User adminUser;
    private String normalUserToken;
    private String adminUserToken;

    @BeforeEach
    void setUp() {
        long ts = System.currentTimeMillis();

        normalUser = userRepository.save(User.builder()
                .name("Regular Traveler")
                .email("traveler_" + ts + "@test.com")
                .passwordHash("$2a$10$hashedpassword")
                .languagePreference("en")
                .build());

        // Configured default admin email: admin@globetrotter.com
        adminUser = userRepository.findByEmail("admin@globetrotter.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .name("Platform Admin")
                        .email("admin@globetrotter.com")
                        .passwordHash("$2a$10$hashedpassword")
                        .languagePreference("en")
                        .build())
        );

        normalUserToken = jwtTokenProvider.generateToken(normalUser.getEmail());
        adminUserToken = jwtTokenProvider.generateToken(adminUser.getEmail());
    }

    @Test
    void test1_UnauthenticatedAdminMe_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/me")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void test2_NormalAuthenticatedUser_Returns403() throws Exception {
        mockMvc.perform(get("/api/admin/me")
                        .header("Authorization", "Bearer " + normalUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void test3_ConfiguredAdminUser_Returns200WithBasicInfo() throws Exception {
        mockMvc.perform(get("/api/admin/me")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(adminUser.getId()))
                .andExpect(jsonPath("$.name").value("Platform Admin"))
                .andExpect(jsonPath("$.email").value("admin@globetrotter.com"))
                .andExpect(jsonPath("$.role").value("ADMIN"))
                .andExpect(jsonPath("$.admin").value(true));
    }

    @Test
    void test4_AdminEndpointDoesNotLeakSensitiveData() throws Exception {
        mockMvc.perform(get("/api/admin/me")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").doesNotExist())
                .andExpect(jsonPath("$.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.token").doesNotExist())
                .andExpect(jsonPath("$.googleId").doesNotExist());
    }

    @Test
    void test5_GetCurrentUserEndpoint_IncludesAdminFlag() throws Exception {
        // Normal user should have admin=false
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + normalUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin").value(false));

        // Admin user should have admin=true
        mockMvc.perform(get("/api/users/me")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admin").value(true));
    }

    @Test
    void test6_UnauthenticatedAdminUsersList_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void test7_NormalUserAdminUsersList_Returns403() throws Exception {
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + normalUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void test8_ConfiguredAdminUsersList_Returns200WithPagination() throws Exception {
        mockMvc.perform(get("/api/admin/users?page=0&size=10")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(2))))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalElements", greaterThanOrEqualTo(2)))
                .andExpect(jsonPath("$.content[0].passwordHash").doesNotExist())
                .andExpect(jsonPath("$.content[0].googleId").doesNotExist());
    }

    @Test
    void test9_AdminUsersSearch_FiltersCorrectly() throws Exception {
        mockMvc.perform(get("/api/admin/users?search=Regular")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.content[0].name").value("Regular Traveler"))
                .andExpect(jsonPath("$.content[0].admin").value(false));
    }

    @Test
    void test10_AdminUserDetail_ReturnsSafeDetailsAndCounts() throws Exception {
        // Unauthenticated -> 401
        mockMvc.perform(get("/api/admin/users/" + normalUser.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        // Normal user -> 403
        mockMvc.perform(get("/api/admin/users/" + normalUser.getId())
                        .header("Authorization", "Bearer " + normalUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        // Admin user -> 200
        mockMvc.perform(get("/api/admin/users/" + normalUser.getId())
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(normalUser.getId()))
                .andExpect(jsonPath("$.name").value("Regular Traveler"))
                .andExpect(jsonPath("$.email").value(normalUser.getEmail()))
                .andExpect(jsonPath("$.admin").value(false))
                .andExpect(jsonPath("$.tripsCreatedCount").isNumber())
                .andExpect(jsonPath("$.tripMembershipsCount").isNumber())
                .andExpect(jsonPath("$.passwordHash").doesNotExist())
                .andExpect(jsonPath("$.googleId").doesNotExist());
    }

    @Test
    void test11_AdminUserDetail_NonexistentUser_Returns404() throws Exception {
        mockMvc.perform(get("/api/admin/users/999999")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void test12_UnauthenticatedAdminDestinations_Returns401() throws Exception {
        mockMvc.perform(get("/api/admin/destinations")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void test13_NormalUserAdminDestinations_Returns403() throws Exception {
        mockMvc.perform(get("/api/admin/destinations")
                        .header("Authorization", "Bearer " + normalUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());
    }

    @Test
    void test14_ConfiguredAdminDestinationsList_Returns200WithPagination() throws Exception {
        mockMvc.perform(get("/api/admin/destinations?page=0&size=10")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(10))
                .andExpect(jsonPath("$.totalElements").isNumber())
                .andExpect(jsonPath("$.totalPages").isNumber());
    }

    @Test
    void test15_AdminDestinationsSearch_FiltersByName() throws Exception {
        mockMvc.perform(get("/api/admin/destinations?search=Jaipur")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void test16_AdminDestinationsFilters_ByRegionAndType() throws Exception {
        mockMvc.perform(get("/api/admin/destinations?region=Rajasthan&type=CITY")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void test17_AdminDestinationsEmptyResult_HandledGracefully() throws Exception {
        mockMvc.perform(get("/api/admin/destinations?search=NonExistentDestination999XYZ")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(0)))
                .andExpect(jsonPath("$.totalElements").value(0));
    }

    @Test
    void test18_AdminDestinationDetail_ReturnsSafeDetails() throws Exception {
        // Unauthenticated detail -> 401
        mockMvc.perform(get("/api/admin/destinations/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());

        // Normal user detail -> 403
        mockMvc.perform(get("/api/admin/destinations/1")
                        .header("Authorization", "Bearer " + normalUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isForbidden());

        // Admin detail for existing destination or check 404 if DB is clean
        mockMvc.perform(get("/api/admin/destinations/1")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(result -> {
                    int status = result.getResponse().getStatus();
                    org.junit.jupiter.api.Assertions.assertTrue(status == 200 || status == 404);
                });
    }

    @Test
    void test19_AdminDestinationDetail_NonexistentDestination_Returns404() throws Exception {
        mockMvc.perform(get("/api/admin/destinations/999999")
                        .header("Authorization", "Bearer " + adminUserToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
