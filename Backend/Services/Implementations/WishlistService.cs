using Backend.DTOs.WishlistDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services;

public class WishlistService : IWishlistService
{
    private readonly IWishlistRepository _wishlistRepository;

    public WishlistService(
        IWishlistRepository wishlistRepository)
    {
        _wishlistRepository = wishlistRepository;
    }

    public async Task<WishlistDto> GetWishlistAsync(int userId)
    {
        var wishlist =
            await _wishlistRepository.GetWithItemsAsync(userId);

        if (wishlist == null)
        {
            return new WishlistDto
            {
                Items = new List<WishlistItemDto>()
            };
        }

        return new WishlistDto
        {
            Id = wishlist.Id,
            CreatedAt = wishlist.CreatedAt,

            Items = wishlist.Items.Select(item =>
                new WishlistItemDto
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    Price = item.Product.Price,

                    ImageUrl = item.Product.Images
                        .Where(image => image.IsPrimary)
                        .Select(image => image.ImageUrl)
                        .FirstOrDefault(),

                    IsInStock =
                        item.Product.StockQuantity > 0,

                    AddedAt = item.AddedAt
                }
            ).ToList()
        };
    }

    public async Task<(bool Success, string Message)>
        AddItemAsync(int userId, int productId)
    {
        var productExists =
            await _wishlistRepository.ProductExistsAsync(productId);

        if (!productExists)
        {
            return (false, "Product was not found.");
        }

        var wishlist =
            await _wishlistRepository.GetByUserIdAsync(userId);

        if (wishlist == null)
        {
            wishlist = new Wishlist
            {
                UserId = userId
            };

            await _wishlistRepository.AddWishlistAsync(wishlist);
            await _wishlistRepository.SaveChangesAsync();
        }

        var existingItem =
            await _wishlistRepository.GetItemAsync(
                wishlist.Id,
                productId
            );

        if (existingItem != null)
        {
            return (
                false,
                "Product is already in your wishlist."
            );
        }

        var item = new WishlistItem
        {
            WishlistId = wishlist.Id,
            ProductId = productId
        };

        await _wishlistRepository.AddItemAsync(item);
        await _wishlistRepository.SaveChangesAsync();

        return (
            true,
            "Product added to wishlist."
        );
    }

    public async Task<(bool Success, string Message)>
        RemoveItemAsync(int userId, int productId)
    {
        var wishlist =
            await _wishlistRepository.GetByUserIdAsync(userId);

        if (wishlist == null)
        {
            return (
                false,
                "Wishlist was not found."
            );
        }

        var item =
            await _wishlistRepository.GetItemAsync(
                wishlist.Id,
                productId
            );

        if (item == null)
        {
            return (
                false,
                "Product is not in your wishlist."
            );
        }

        _wishlistRepository.RemoveItem(item);
        await _wishlistRepository.SaveChangesAsync();

        return (
            true,
            "Product removed from wishlist."
        );
    }
}