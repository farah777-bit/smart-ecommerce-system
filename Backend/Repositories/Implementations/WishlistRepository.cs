using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories;

public class WishlistRepository : IWishlistRepository
{
    private readonly ApplicationDbContext _context;

    public WishlistRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Wishlist?> GetByUserIdAsync(int userId)
    {
        return await _context.Wishlists
            .FirstOrDefaultAsync(w => w.UserId == userId);
    }

    public async Task<Wishlist?> GetWithItemsAsync(int userId)
    {
        return await _context.Wishlists
            .Include(w => w.Items)
                .ThenInclude(i => i.Product)
                    .ThenInclude(p => p.Images)
            .FirstOrDefaultAsync(w => w.UserId == userId);
    }

    public async Task<WishlistItem?> GetItemAsync(
        int wishlistId,
        int productId)
    {
        return await _context.WishlistItems
            .FirstOrDefaultAsync(i =>
                i.WishlistId == wishlistId &&
                i.ProductId == productId);
    }

    public async Task<bool> ProductExistsAsync(int productId)
    {
        return await _context.Products
            .AnyAsync(p => p.Id == productId);
    }

    public async Task AddWishlistAsync(Wishlist wishlist)
    {
        await _context.Wishlists.AddAsync(wishlist);
    }

    public async Task AddItemAsync(WishlistItem item)
    {
        await _context.WishlistItems.AddAsync(item);
    }

    public void RemoveItem(WishlistItem item)
    {
        _context.WishlistItems.Remove(item);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}