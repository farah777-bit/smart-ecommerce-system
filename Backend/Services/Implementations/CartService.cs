using Backend.DTOs.CartDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class CartService : ICartService
{
    private readonly ICartRepository _cartRepository;

    public CartService(ICartRepository cartRepository)
    {
        _cartRepository = cartRepository;
    }

    public async Task<CartDto> GetCartAsync(int userId)
    {
        var cart = await _cartRepository
            .GetByUserIdAsync(userId);

        return cart ?? new CartDto();
    }

    public async Task<CartDto> AddItemAsync(
        int userId,
        AddToCartDto addDto)
    {
        if (addDto.Quantity < 1)
        {
            throw new ArgumentException(
                "Quantity must be at least 1."
            );
        }

        var product = await _cartRepository
            .GetProductByIdAsync(addDto.ProductId);

        if (product == null)
        {
            throw new ArgumentException(
                "Product does not exist or is not active."
            );
        }

        if (addDto.Quantity > product.StockQuantity)
        {
            throw new InvalidOperationException(
                "The requested quantity exceeds available stock."
            );
        }

        var cart = await _cartRepository
            .GetEntityByUserIdAsync(userId);

        if (cart == null)
        {
            cart = new Cart
            {
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _cartRepository.AddCartAsync(cart);
            await _cartRepository.SaveChangesAsync();
        }

        var existingItem = await _cartRepository
            .GetItemAsync(cart.Id, product.Id);

        if (existingItem != null)
        {
            var newQuantity =
                existingItem.Quantity + addDto.Quantity;

            if (newQuantity > product.StockQuantity)
            {
                throw new InvalidOperationException(
                    "The requested quantity exceeds available stock."
                );
            }

            existingItem.Quantity = newQuantity;
            existingItem.UnitPrice = product.Price;
        }
        else
        {
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = product.Id,
                Quantity = addDto.Quantity,
                UnitPrice = product.Price,
                AddedAt = DateTime.UtcNow
            };

            await _cartRepository.AddItemAsync(cartItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;

        await _cartRepository.SaveChangesAsync();

        return await _cartRepository.GetByUserIdAsync(userId)
            ?? new CartDto();
    }

    public async Task<bool> UpdateItemQuantityAsync(
        int userId,
        int itemId,
        UpdateCartItemQuantityDto updateDto)
    {
        if (updateDto.Quantity < 1)
        {
            throw new ArgumentException(
                "Quantity must be at least 1."
            );
        }

        var cartItem = await _cartRepository
            .GetItemByIdAsync(itemId, userId);

        if (cartItem == null)
            return false;

        if (updateDto.Quantity >
            cartItem.Product.StockQuantity)
        {
            throw new InvalidOperationException(
                "The requested quantity exceeds available stock."
            );
        }

        cartItem.Quantity = updateDto.Quantity;
        cartItem.UnitPrice = cartItem.Product.Price;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        await _cartRepository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> RemoveItemAsync(
        int userId,
        int itemId)
    {
        var cartItem = await _cartRepository
            .GetItemByIdAsync(itemId, userId);

        if (cartItem == null)
            return false;

        cartItem.Cart.UpdatedAt = DateTime.UtcNow;

        _cartRepository.DeleteItem(cartItem);
        await _cartRepository.SaveChangesAsync();

        return true;
    }
}