using Backend.DTOs.CartDTOs;

namespace Backend.Services.Interfaces;

public interface ICartService
{
    Task<CartDto> GetCartAsync(int userId);

    Task<CartDto> AddItemAsync(
        int userId,
        AddToCartDto addDto
    );

    Task<bool> UpdateItemQuantityAsync(
        int userId,
        int itemId,
        UpdateCartItemQuantityDto updateDto
    );

    Task<bool> RemoveItemAsync(
        int userId,
        int itemId
    );
}