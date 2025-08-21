package com.oracle.usermanagement.mapper;

import com.oracle.usermanagement.dto.UserRequestDto;
import com.oracle.usermanagement.dto.UserResponseDto;
import com.oracle.usermanagement.entity.User;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Mapper utility for converting between User entities and DTOs
 */
@Component
public class UserMapper {

    /**
     * Convert User entity to UserResponseDto
     * @param user the user entity
     * @return UserResponseDto
     */
    public UserResponseDto toResponseDto(User user) {
        if (user == null) {
            return null;
        }

        UserResponseDto dto = new UserResponseDto();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setRole(user.getRole());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        dto.setFlightId(user.getFlightId());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setLastLogin(user.getLastLogin());
        dto.setStaff(user.isStaff());
        dto.setAdmin(user.isAdmin());
        dto.setPassenger(user.isPassenger());

        return dto;
    }

    /**
     * Convert UserRequestDto to User entity
     * @param requestDto the request DTO
     * @return User entity
     */
    public User toEntity(UserRequestDto requestDto) {
        if (requestDto == null) {
            return null;
        }

        User user = new User();
        user.setUsername(requestDto.getUsername());
        user.setPassword(requestDto.getPassword());
        user.setRole(requestDto.getRole());
        user.setName(requestDto.getName());
        user.setEmail(requestDto.getEmail());
        user.setPhoneNumber(requestDto.getPhoneNumber());
        user.setFlightId(requestDto.getFlightId());

        return user;
    }

    /**
     * Convert list of User entities to list of UserResponseDtos
     * @param users list of user entities
     * @return list of UserResponseDtos
     */
    public List<UserResponseDto> toResponseDtoList(List<User> users) {
        if (users == null) {
            return null;
        }

        return users.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * Update existing User entity with data from UserRequestDto
     * @param existingUser the existing user entity
     * @param requestDto the request DTO with updated data
     */
    public void updateEntityFromDto(User existingUser, UserRequestDto requestDto) {
        if (existingUser == null || requestDto == null) {
            return;
        }

        existingUser.setUsername(requestDto.getUsername());
        existingUser.setPassword(requestDto.getPassword());
        existingUser.setRole(requestDto.getRole());
        existingUser.setName(requestDto.getName());
        existingUser.setEmail(requestDto.getEmail());
        existingUser.setPhoneNumber(requestDto.getPhoneNumber());
        existingUser.setFlightId(requestDto.getFlightId());
    }
}
