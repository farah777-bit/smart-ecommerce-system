using System.Security.Claims;
using Backend.DTOs.CartDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly ICartService _cartService;

    public CartController(ICartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();

        var cart = await _cartService
            .GetCartAsync(userId);

        return Ok(cart);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem(
        AddToCartDto addDto)
    {
        try
        {
            var userId = GetUserId();

            var cart = await _cartService
                .AddItemAsync(userId, addDto);

            return Ok(cart);
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }

    [HttpPut("items/{itemId:int}")]
    public async Task<IActionResult> UpdateQuantity(
        int itemId,
        UpdateCartItemQuantityDto updateDto)
    {
        try
        {
            var userId = GetUserId();

            var updated = await _cartService
                .UpdateItemQuantityAsync(
                    userId,
                    itemId,
                    updateDto
                );

            if (!updated)
            {
                return NotFound(new
                {
                    message = "Cart item was not found."
                });
            }

            return NoContent();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
        catch (InvalidOperationException exception)
        {
            return BadRequest(new
            {
                message = exception.Message
            });
        }
    }

    [HttpDelete("items/{itemId:int}")]
    public async Task<IActionResult> RemoveItem(int itemId)
    {
        var userId = GetUserId();

        var removed = await _cartService
            .RemoveItemAsync(userId, itemId);

        if (!removed)
        {
            return NotFound(new
            {
                message = "Cart item was not found."
            });
        }

        return NoContent();
    }

    private int GetUserId()
    {
        var userIdValue = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            throw new UnauthorizedAccessException(
                "Invalid authenticated user."
            );
        }

        return userId;
    }
}