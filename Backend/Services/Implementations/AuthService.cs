using Backend.DTOs.UserDTOs;
using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Backend.Services.Implementations;

public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    public async Task<(
        bool Success,
        string Message,
        IEnumerable<string>? Errors
    )> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser =
            await _userManager.FindByEmailAsync(
                registerDto.Email
            );

        if (existingUser != null)
        {
            return (
                false,
                "Email already exists.",
                null
            );
        }

        var user = new ApplicationUser
        {
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };

        var createResult =
            await _userManager.CreateAsync(
                user,
                registerDto.Password
            );

        if (!createResult.Succeeded)
        {
            return (
                false,
                "Registration failed.",
                createResult.Errors.Select(
                    error => error.Description
                )
            );
        }

        var roleResult =
            await _userManager.AddToRoleAsync(
                user,
                "Customer"
            );

        if (!roleResult.Succeeded)
        {
            // منع بقاء مستخدم بلا دور
            await _userManager.DeleteAsync(user);

            return (
                false,
                "Could not assign Customer role.",
                roleResult.Errors.Select(
                    error => error.Description
                )
            );
        }

        return (
            true,
            "User registered successfully.",
            null
        );
    }

    public async Task<(
        LoginResponseDto? Response,
        string? Error
    )> LoginAsync(LoginDto loginDto)
    {
        var user =
            await _userManager.FindByEmailAsync(
                loginDto.Email
            );

        if (user == null)
        {
            return (
                null,
                "Invalid email or password."
            );
        }

        if (!user.IsActive)
        {
            return (
                null,
                "User account is inactive."
            );
        }

        var passwordValid =
            await _userManager.CheckPasswordAsync(
                user,
                loginDto.Password
            );

        if (!passwordValid)
        {
            return (
                null,
                "Invalid email or password."
            );
        }

        var roles =
            await _userManager.GetRolesAsync(user);

        var claims = CreateClaims(user, roles);

        var expiresAt = DateTime.UtcNow.AddHours(2);

        var token = CreateToken(claims, expiresAt);

        var response = new LoginResponseDto
        {
            Token = token,
            Expiration = expiresAt,

            User = new AuthenticatedUserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                Roles = roles
            }
        };

        return (response, null);
    }

    private static List<Claim> CreateClaims(
        ApplicationUser user,
        IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),
new(
                ClaimTypes.Name,
                user.UserName ?? string.Empty
            ),

            new(
                ClaimTypes.Email,
                user.Email ?? string.Empty
            ),

            new(
                "FullName",
                user.FullName
            )
        };

foreach (var role in roles)
{
    claims.Add(
        new Claim(ClaimTypes.Role, role)
    );
}

return claims;
    }

    private string CreateToken(
        IEnumerable<Claim> claims,
        DateTime expiresAt)
{
    var jwtKey = _configuration["Jwt:Key"]
        ?? throw new InvalidOperationException(
            "JWT Key is missing."
        );

    var key = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwtKey)
    );

    var credentials = new SigningCredentials(
        key,
        SecurityAlgorithms.HmacSha256
    );

    var token = new JwtSecurityToken(
        issuer: _configuration["Jwt:Issuer"],
        audience: _configuration["Jwt:Audience"],
        claims: claims,
        expires: expiresAt,
        signingCredentials: credentials
    );

    return new JwtSecurityTokenHandler()
        .WriteToken(token);
}
}