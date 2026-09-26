using System.Security.Claims;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;

    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet]
    public async Task<IActionResult> GetWishlist()
    {
        var userId = GetUserId();

        var wishlist =
            await _wishlistService.GetWishlistAsync(userId);

        return Ok(wishlist);
    }

    [HttpPost("items/{productId:int}")]
    public async Task<IActionResult> AddItem(int productId)
    {
        var userId = GetUserId();

        var result =
            await _wishlistService.AddItemAsync(
                userId,
                productId
            );

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message
        });
    }

    [HttpDelete("items/{productId:int}")]
    public async Task<IActionResult> RemoveItem(int productId)
    {
        var userId = GetUserId();

        var result =
            await _wishlistService.RemoveItemAsync(
                userId,
                productId
            );

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message
        });
    }

    private int GetUserId()
    {
        var userIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid authenticated user."
            );
        }

        return userId;
    }
}