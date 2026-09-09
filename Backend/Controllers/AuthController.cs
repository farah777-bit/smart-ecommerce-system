using Backend.DTOs.UserDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(
        RegisterDto registerDto)
    {
        var result =
            await _authService.RegisterAsync(registerDto);

        if (!result.Success)
        {
            if (result.Errors != null)
            {
                return BadRequest(new
                {
                    message = result.Message,
                    errors = result.Errors
                });
            }

            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message,
            role = "Customer"
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(
        LoginDto loginDto)
    {
        var result =
            await _authService.LoginAsync(loginDto);

        if (result.Response == null)
        {
            return Unauthorized(new
            {
                message = result.Error
            });
        }

        return Ok(result.Response);
    }

    [Authorize]
    [HttpGet("profile")]
    public IActionResult Profile()
    {
        return Ok(new
        {
            message = "You are authenticated.",

            userId = User.FindFirst(
                ClaimTypes.NameIdentifier
            )?.Value,

            email = User.FindFirst(
                ClaimTypes.Email
            )?.Value,

            fullName = User.FindFirst(
                "FullName"
            )?.Value,

            roles = User.FindAll(
                    ClaimTypes.Role
                )
                .Select(claim => claim.Value)
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