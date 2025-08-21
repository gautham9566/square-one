package com.oracle.usermanagement.service;

import com.oracle.usermanagement.entity.User;
import com.oracle.usermanagement.exception.UserAlreadyExistsException;
import com.oracle.usermanagement.exception.UserNotFoundException;
import com.oracle.usermanagement.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password");
        testUser.setRole("admin");
        testUser.setName("Test User");
        testUser.setEmail("test@example.com");
        testUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getAllUsers_ShouldReturnAllUsers() {
        // Given
        List<User> users = Arrays.asList(testUser);
        when(userRepository.findAll()).thenReturn(users);

        // When
        List<User> result = userService.getAllUsers();

        // Then
        assertEquals(1, result.size());
        assertEquals(testUser.getUsername(), result.get(0).getUsername());
        verify(userRepository).findAll();
    }

    @Test
    void getUserById_ShouldReturnUser_WhenUserExists() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.getUserById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals(testUser.getUsername(), result.get().getUsername());
        verify(userRepository).findById(1L);
    }

    @Test
    void getUsersByRole_ShouldReturnUsersWithRole() {
        // Given
        List<User> adminUsers = Arrays.asList(testUser);
        when(userRepository.findByRole("admin")).thenReturn(adminUsers);

        // When
        List<User> result = userService.getUsersByRole("admin");

        // Then
        assertEquals(1, result.size());
        assertEquals("admin", result.get(0).getRole());
        verify(userRepository).findByRole("admin");
    }

    @Test
    void getUsersByRole_ShouldThrowException_WhenInvalidRole() {
        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            userService.getUsersByRole("invalidrole");
        });
    }

    @Test
    void getStaffByFlightId_ShouldReturnStaffList() {
        // Given
        testUser.setRole("inflightStaff");
        testUser.setFlightId(1L);
        List<User> staff = Arrays.asList(testUser);
        when(userRepository.findStaffByFlightId(1L)).thenReturn(staff);

        // When
        List<User> result = userService.getStaffByFlightId(1L);

        // Then
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getFlightId());
        verify(userRepository).findStaffByFlightId(1L);
    }

    @Test
    void createUser_ShouldCreateUser_WhenUsernameIsUnique() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.createUser(testUser);

        // Then
        assertEquals(testUser.getUsername(), result.getUsername());
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).save(testUser);
    }

    @Test
    void createUser_ShouldThrowException_WhenUsernameExists() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // When & Then
        assertThrows(UserAlreadyExistsException.class, () -> {
            userService.createUser(testUser);
        });
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void updateUser_ShouldUpdateUser_WhenUserExists() {
        // Given
        User updatedUser = new User();
        updatedUser.setUsername("updateduser");
        updatedUser.setPassword("newpassword");
        updatedUser.setRole("admin");
        updatedUser.setName("Updated User");

        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(userRepository.existsByUsername("updateduser")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userService.updateUser(1L, updatedUser);

        // Then
        assertNotNull(result);
        verify(userRepository).findById(1L);
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.updateUser(1L, testUser);
        });
        verify(userRepository).findById(1L);
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deleteUser_ShouldDeleteUser_WhenUserExists() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(true);

        // When
        userService.deleteUser(1L);

        // Then
        verify(userRepository).existsById(1L);
        verify(userRepository).deleteById(1L);
    }

    @Test
    void deleteUser_ShouldThrowException_WhenUserNotFound() {
        // Given
        when(userRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(UserNotFoundException.class, () -> {
            userService.deleteUser(1L);
        });
        verify(userRepository).existsById(1L);
        verify(userRepository, never()).deleteById(any());
    }

    @Test
    void userExists_ShouldReturnTrue_WhenUserExists() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        // When
        boolean result = userService.userExists("testuser");

        // Then
        assertTrue(result);
        verify(userRepository).existsByUsername("testuser");
    }

    @Test
    void countUsersByRole_ShouldReturnCount() {
        // Given
        when(userRepository.countByRole("admin")).thenReturn(5L);

        // When
        long result = userService.countUsersByRole("admin");

        // Then
        assertEquals(5L, result);
        verify(userRepository).countByRole("admin");
    }
}
