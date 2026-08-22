package com.globetrotter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.globetrotter.dto.AuthResponse;
import com.globetrotter.dto.CreateTripRequest;
import com.globetrotter.dto.SignupRequest;
import com.globetrotter.dto.UpdateTripRequest;
import com.globetrotter.repository.TripRepository;
import com.globetrotter.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class TripIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TripRepository tripRepository;

    private String userAToken;
    private String userBToken;

    @BeforeEach
    void setUp() throws Exception {
        tripRepository.deleteAll();
        userRepository.deleteAll();

        // Register User A
        SignupRequest signupA = new SignupRequest("User A", "usera@example.com", "Password123!");
        MvcResult resultA = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupA)))
                .andExpect(status().isCreated())
                .andReturn();
        AuthResponse authA = objectMapper.readValue(resultA.getResponse().getContentAsString(), AuthResponse.class);
        userAToken = authA.getToken();

        // Register User B
        SignupRequest signupB = new SignupRequest("User B", "userb@example.com", "Password123!");
        MvcResult resultB = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupB)))
                .andExpect(status().isCreated())
                .andReturn();
        AuthResponse authB = objectMapper.readValue(resultB.getResponse().getContentAsString(), AuthResponse.class);
        userBToken = authB.getToken();
    }

    @Test
    @DisplayName("1. Authenticated user can create a trip")
    void test1_AuthenticatedUserCanCreateTrip() throws Exception {
        CreateTripRequest request = new CreateTripRequest(
                "Euro Summer 2026",
                "Backpacking through Europe",
                LocalDate.of(2026, 6, 1),
                LocalDate.of(2026, 6, 15),
                "https://example.com/paris.jpg"
        );

        mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.name", is("Euro Summer 2026")))
                .andExpect(jsonPath("$.description", is("Backpacking through Europe")))
                .andExpect(jsonPath("$.startDate", is("2026-06-01")))
                .andExpect(jsonPath("$.endDate", is("2026-06-15")))
                .andExpect(jsonPath("$.coverPhoto", is("https://example.com/paris.jpg")));

        assertEquals(1, tripRepository.count());
    }

    @Test
    @DisplayName("2. Unauthenticated user cannot create a trip")
    void test2_UnauthenticatedUserCannotCreateTrip() throws Exception {
        CreateTripRequest request = new CreateTripRequest(
                "Unauthorized Trip",
                "No token",
                LocalDate.of(2026, 7, 1),
                LocalDate.of(2026, 7, 10),
                null
        );

        mockMvc.perform(post("/api/trips")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("3. Invalid trip name is rejected")
    void test3_InvalidTripNameIsRejected() throws Exception {
        CreateTripRequest request = new CreateTripRequest(
                "", // Blank name
                "Test description",
                LocalDate.of(2026, 8, 1),
                LocalDate.of(2026, 8, 10),
                null
        );

        mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("4. Missing dates are rejected")
    void test4_MissingDatesAreRejected() throws Exception {
        CreateTripRequest request = new CreateTripRequest(
                "Missing End Date",
                "Test description",
                LocalDate.of(2026, 8, 1),
                null, // missing end date
                null
        );

        mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("5. Start date after end date is rejected")
    void test5_StartDateAfterEndDateIsRejected() throws Exception {
        CreateTripRequest request = new CreateTripRequest(
                "Time Travel Trip",
                "Invalid dates",
                LocalDate.of(2026, 8, 15),
                LocalDate.of(2026, 8, 1), // start date after end date
                null
        );

        mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("6. User can retrieve their own trips")
    void test6_UserCanRetrieveTheirOwnTrips() throws Exception {
        // Create 2 trips for User A
        CreateTripRequest request1 = new CreateTripRequest("Trip 1", "Desc 1", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), null);
        CreateTripRequest request2 = new CreateTripRequest("Trip 2", "Desc 2", LocalDate.of(2026, 7, 1), LocalDate.of(2026, 7, 5), null);

        mockMvc.perform(post("/api/trips").header("Authorization", "Bearer " + userAToken).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request1))).andExpect(status().isCreated());
        mockMvc.perform(post("/api/trips").header("Authorization", "Bearer " + userAToken).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(request2))).andExpect(status().isCreated());

        // Create 1 trip for User B
        CreateTripRequest requestB = new CreateTripRequest("User B Trip", "Desc B", LocalDate.of(2026, 9, 1), LocalDate.of(2026, 9, 5), null);
        mockMvc.perform(post("/api/trips").header("Authorization", "Bearer " + userBToken).contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(requestB))).andExpect(status().isCreated());

        // User A retrieves trips
        mockMvc.perform(get("/api/trips")
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("Trip 1")))
                .andExpect(jsonPath("$[1].name", is("Trip 2")));
    }

    @Test
    @DisplayName("7. User can retrieve their own trip by ID")
    void test7_UserCanRetrieveTheirOwnTripById() throws Exception {
        CreateTripRequest request = new CreateTripRequest("Japan Tour", "Tokyo and Kyoto", LocalDate.of(2026, 10, 1), LocalDate.of(2026, 10, 14), null);
        MvcResult createResult = mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long tripId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        mockMvc.perform(get("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(tripId.intValue())))
                .andExpect(jsonPath("$.name", is("Japan Tour")));
    }

    @Test
    @DisplayName("8. User cannot access another user's private trip")
    void test8_UserCannotAccessAnotherUsersPrivateTrip() throws Exception {
        // User A creates a trip
        CreateTripRequest request = new CreateTripRequest("User A Private Trip", "Secret", LocalDate.of(2026, 11, 1), LocalDate.of(2026, 11, 5), null);
        MvcResult createResult = mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long tripId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        // User B tries to access User A's trip -> Expect 404 Not Found
        mockMvc.perform(get("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("9. Owner can update their trip")
    void test9_OwnerCanUpdateTheirTrip() throws Exception {
        CreateTripRequest request = new CreateTripRequest("Old Title", "Old Desc", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), null);
        MvcResult createResult = mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long tripId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        UpdateTripRequest updateRequest = new UpdateTripRequest("Updated Title", "Updated Desc", LocalDate.of(2026, 6, 2), LocalDate.of(2026, 6, 8), "https://example.com/new.jpg");

        mockMvc.perform(put("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(tripId.intValue())))
                .andExpect(jsonPath("$.name", is("Updated Title")))
                .andExpect(jsonPath("$.description", is("Updated Desc")))
                .andExpect(jsonPath("$.startDate", is("2026-06-02")))
                .andExpect(jsonPath("$.endDate", is("2026-06-08")))
                .andExpect(jsonPath("$.coverPhoto", is("https://example.com/new.jpg")));
    }

    @Test
    @DisplayName("10. Another user cannot update the trip")
    void test10_AnotherUserCannotUpdateTrip() throws Exception {
        CreateTripRequest request = new CreateTripRequest("User A Trip", "Original", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), null);
        MvcResult createResult = mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long tripId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        UpdateTripRequest updateRequest = new UpdateTripRequest("Hacked Title", "Hacked", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), null);

        // User B tries to update User A's trip -> Expect 404 Not Found
        mockMvc.perform(put("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("11. Owner can delete their trip")
    void test11_OwnerCanDeleteTheirTrip() throws Exception {
        CreateTripRequest request = new CreateTripRequest("Trip to Delete", "Temporary", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), null);
        MvcResult createResult = mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long tripId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        // User A deletes trip
        mockMvc.perform(delete("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isNoContent());

        // Verify trip is deleted
        mockMvc.perform(get("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isNotFound());
    }

    @Test
    @DisplayName("12. Another user cannot delete the trip")
    void test12_AnotherUserCannotDeleteTrip() throws Exception {
        CreateTripRequest request = new CreateTripRequest("Protected Trip", "Important", LocalDate.of(2026, 6, 1), LocalDate.of(2026, 6, 5), null);
        MvcResult createResult = mockMvc.perform(post("/api/trips")
                        .header("Authorization", "Bearer " + userAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        Long tripId = objectMapper.readTree(createResult.getResponse().getContentAsString()).get("id").asLong();

        // User B tries to delete User A's trip -> Expect 404 Not Found
        mockMvc.perform(delete("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userBToken))
                .andExpect(status().isNotFound());

        // Verify trip still exists for User A
        mockMvc.perform(get("/api/trips/" + tripId)
                        .header("Authorization", "Bearer " + userAToken))
                .andExpect(status().isOk());
    }
}
