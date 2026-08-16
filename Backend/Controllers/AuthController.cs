using Backend.DTOs.UserDTOs;
using Backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto registerDto)
    {
        var existingUser =
            await _userManager.FindByEmailAsync(registerDto.Email);

        if (existingUser != null)
        {
            return BadRequest(new
            {
                message = "Email already exists."
            });
        }

        var user = new ApplicationUser
        {
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            UserName = registerDto.Email
        };

        var result =
            await _userManager.CreateAsync(
                user,
                registerDto.Password
            );

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var roleResult =
            await _userManager.AddToRoleAsync(user, "Customer");

        if (!roleResult.Succeeded)
        {
            return BadRequest(roleResult.Errors);
        }

        return Ok(new
        {
            message = "User registered successfully.",
            role = "Customer"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto loginDto)
    {
        var user =
            await _userManager.FindByEmailAsync(loginDto.Email);

        if (user == null)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        if (!user.IsActive)
        {
            return Unauthorized(new
            {
                message = "User account is inactive."
            });
        }

        var passwordValid =
            await _userManager.CheckPasswordAsync(
                user,
                loginDto.Password
            );

        if (!passwordValid)
        {
            return Unauthorized(new
            {
                message = "Invalid email or password."
            });
        }

        var roles = await _userManager.GetRolesAsync(user);

        var claims = new List<Claim>
    {
        new Claim(
            ClaimTypes.NameIdentifier,
            user.Id.ToString()
        ),

        new Claim(
            ClaimTypes.Name,
            user.UserName ?? string.Empty
        ),

        new Claim(
            ClaimTypes.Email,
            user.Email ?? string.Empty
        ),

        new Claim(
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

        var jwtKey = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT Key is missing."
            );

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );

        var expiresAt = DateTime.UtcNow.AddHours(2);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expiresAt,
            signingCredentials: credentials
        );

        var tokenString =
            new JwtSecurityTokenHandler()
                .WriteToken(token);

        return Ok(new
        {
            token = tokenString,
            expiration = expiresAt,

            user = new
            {
                id = user.Id,
                fullName = user.FullName,
                email = user.Email,
                roles = roles
            }
        });
    }

    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return Ok(new
        {
            message = "You are authenticated.",
            userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            email = User.FindFirst(ClaimTypes.Email)?.Value,
            fullName = User.FindFirst("FullName")?.Value,
            roles = User.FindAll(ClaimTypes.Role)
                        .Select(r => r.Value)
                        .ToList()
        });
    }
    [Authorize(Roles = "Admin")]
    [HttpGet("admin-test")]
    public IActionResult AdminTest()
    {
        return Ok(new
        {
            message = "Welcome Admin."
        });
    }
}