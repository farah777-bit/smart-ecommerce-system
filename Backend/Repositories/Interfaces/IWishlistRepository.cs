using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IWishlistRepository
{
    Task<Wishlist?> GetByUserIdAsync(int userId);

    Task<Wishlist?> GetWithItemsAsync(int userId);

    Task<WishlistItem?> GetItemAsync(
        int wishlistId,
        int productId
    );

    Task<bool> ProductExistsAsync(int productId);

    Task AddWishlistAsync(Wishlist wishlist);

    Task AddItemAsync(WishlistItem item);

    void RemoveItem(WishlistItem item);

    Task SaveChangesAsync();
}