namespace Backend.DTOs.UserDTOs;

public class LoginResponseDto
{
    public string Token { get; set; } = string.Empty;

    public DateTime Expiration { get; set; }

    public AuthenticatedUserDto User { get; set; } =
        new();
}