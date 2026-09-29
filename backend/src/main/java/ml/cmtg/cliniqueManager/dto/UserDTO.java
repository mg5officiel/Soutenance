package ml.cmtg.cliniqueManager.dto;

import ml.cmtg.cliniqueManager.entity.User;

public record UserDTO(
        Long id,
        String username,
        String role
) {
    public static UserDTO from(User user) {
        return new UserDTO(user.getId(), user.getUsername(), user.getRole().name());
    }
}
