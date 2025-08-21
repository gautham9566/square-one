package com.oracle.usermanagement.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.oracle.usermanagement.dto.UserRequestDto;
import com.oracle.usermanagement.entity.User;
import com.oracle.usermanagement.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@ActiveProfiles("test")
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getAllUsers_ShouldReturnUserList() throws Exception {
        // Given
        List<User> users = Arrays.asList(
                createTestUser(1L, "admin1", "admin", "Alice Admin"),
                createTestUser(2L, "staff1", "inflightStaff", "Bob Staff")
        );
        when(userService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    void getUserById_ShouldReturnUser_WhenUserExists() throws Exception {
        // Given
        User user = createTestUser(1L, "admin1", "admin", "Alice Admin");
        when(userService.getUserById(1L)).thenReturn(Optional.of(user));

        // When & Then
        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.userId").value(1))
                .andExpect(jsonPath("$.data.username").value("admin1"));
    }

    @Test
    void getUsersByRole_ShouldReturnUsersWithRole() throws Exception {
        // Given
        List<User> adminUsers = Arrays.asList(
                createTestUser(1L, "admin1", "admin", "Alice Admin")
        );
        when(userService.getUsersByRole("admin")).thenReturn(adminUsers);

        // When & Then
        mockMvc.perform(get("/users/role/admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].role").value("admin"));
    }

    @Test
    void getStaffByFlightId_ShouldReturnStaffList() throws Exception {
        // Given
        List<User> staff = Arrays.asList(
                createTestStaffUser(2L, "staff1", "inflightStaff", "Bob Staff", 1L)
        );
        when(userService.getStaffByFlightId(1L)).thenReturn(staff);

        // When & Then
        mockMvc.perform(get("/users/flight/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].flightId").value(1));
    }

    @Test
    void createUser_ShouldReturnCreatedUser() throws Exception {
        // Given
        UserRequestDto requestDto = new UserRequestDto();
        requestDto.setUsername("newuser");
        requestDto.setPassword("password");
        requestDto.setRole("passenger");
        requestDto.setName("New User");
        requestDto.setEmail("newuser@example.com");

        User createdUser = createTestUser(3L, "newuser", "passenger", "New User");
        when(userService.createUser(any(User.class))).thenReturn(createdUser);

        // When & Then
        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("newuser"));
    }

    @Test
    void updateUser_ShouldReturnUpdatedUser() throws Exception {
        // Given
        UserRequestDto requestDto = new UserRequestDto();
        requestDto.setUsername("updateduser");
        requestDto.setPassword("newpassword");
        requestDto.setRole("admin");
        requestDto.setName("Updated User");

        User updatedUser = createTestUser(1L, "updateduser", "admin", "Updated User");
        when(userService.updateUser(eq(1L), any(User.class))).thenReturn(updatedUser);

        // When & Then
        mockMvc.perform(put("/users/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.username").value("updateduser"));
    }

    @Test
    void deleteUser_ShouldReturnSuccessMessage() throws Exception {
        // When & Then
        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User deleted successfully"));
    }

    private User createTestUser(Long id, String username, String role, String name) {
        User user = new User();
        user.setUserId(id);
        user.setUsername(username);
        user.setPassword("hashedpassword");
        user.setRole(role);
        user.setName(name);
        user.setEmail(username + "@example.com");
        user.setCreatedAt(LocalDateTime.now());
        return user;
    }

    private User createTestStaffUser(Long id, String username, String role, String name, Long flightId) {
        User user = createTestUser(id, username, role, name);
        user.setFlightId(flightId);
        return user;
    }
}
