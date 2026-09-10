using Backend.Data;
using Backend.DTOs.CartDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implementations;

public class CartRepository : ICartRepository
{
    private readonly ApplicationDbContext _context;

    public CartRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<CartDto?> GetByUserIdAsync(int userId)
    {
        return await _context.Carts
            .AsNoTracking()
            .Where(cart => cart.UserId == userId)
            .Select(cart => new CartDto
            {
                Id = cart.Id,

                Items = cart.Items
                    .OrderByDescending(item => item.AddedAt)
                    .Select(item => new CartItemDto
                    {
                        Id = item.Id,
                        ProductId = item.ProductId,
                        ProductName = item.Product.Name,

                        PrimaryImageUrl = item.Product.Images
                            .Where(image => image.IsPrimary)
                            .Select(image => image.ImageUrl)
                            .FirstOrDefault(),

                        UnitPrice = item.UnitPrice,
                        Quantity = item.Quantity,
                        StockQuantity = item.Product.StockQuantity,

                        TotalPrice =
                            item.UnitPrice * item.Quantity
                    })
                    .ToList(),

                TotalItems = cart.Items.Sum(
                    item => item.Quantity
                ),

                Subtotal = cart.Items.Sum(
                    item => item.UnitPrice * item.Quantity
                )
            })
            .FirstOrDefaultAsync();
    }

    public async Task<Cart?> GetEntityByUserIdAsync(int userId)
    {
        return await _context.Carts
            .FirstOrDefaultAsync(
                cart => cart.UserId == userId
            );
    }

    public async Task<CartItem?> GetItemAsync(
        int cartId,
        int productId)
    {
        return await _context.CartItems
            .FirstOrDefaultAsync(item =>
                item.CartId == cartId &&
                item.ProductId == productId
            );
    }

    public async Task<CartItem?> GetItemByIdAsync(
        int itemId,
        int userId)
    {
        return await _context.CartItems
            .Include(item => item.Product)
            .Include(item => item.Cart)
            .FirstOrDefaultAsync(item =>
                item.Id == itemId &&
                item.Cart.UserId == userId
            );
    }

    public async Task<Product?> GetProductByIdAsync(
        int productId)
    {
        return await _context.Products
            .FirstOrDefaultAsync(product =>
                product.Id == productId &&
                product.IsActive
            );
    }

    public async Task AddCartAsync(Cart cart)
    {
        await _context.Carts.AddAsync(cart);
    }

    public async Task AddItemAsync(CartItem cartItem)
    {
        await _context.CartItems.AddAsync(cartItem);
    }

    public void DeleteItem(CartItem cartItem)
    {
        _context.CartItems.Remove(cartItem);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}