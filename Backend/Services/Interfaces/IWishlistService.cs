using Backend.DTOs.WishlistDTOs;

namespace Backend.Services.Interfaces;

public interface IWishlistService
{
    Task<WishlistDto> GetWishlistAsync(int userId);

    Task<(bool Success, string Message)> AddItemAsync(
        int userId,
        int productId
    );

    Task<(bool Success, string Message)> RemoveItemAsync(
        int userId,
        int productId
    );
}