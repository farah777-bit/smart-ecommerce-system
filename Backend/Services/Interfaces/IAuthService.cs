using Backend.DTOs.UserDTOs;

namespace Backend.Services.Interfaces;

public interface IAuthService
{
    Task<(
        bool Success,
        string Message,
        IEnumerable<string>? Errors
    )> RegisterAsync(RegisterDto registerDto);

    Task<(
        LoginResponseDto? Response,
        string? Error
    )> LoginAsync(LoginDto loginDto);
}