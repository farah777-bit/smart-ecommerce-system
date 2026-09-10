using Backend.DTOs.CartDTOs;
using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface ICartRepository
{
    Task<CartDto?> GetByUserIdAsync(int userId);

    Task<Cart?> GetEntityByUserIdAsync(int userId);

    Task<CartItem?> GetItemAsync(int cartId, int productId);

    Task<CartItem?> GetItemByIdAsync(int itemId, int userId);

    Task<Product?> GetProductByIdAsync(int productId);

    Task AddCartAsync(Cart cart);

    Task AddItemAsync(CartItem cartItem);

    void DeleteItem(CartItem cartItem);

    Task SaveChangesAsync();
}