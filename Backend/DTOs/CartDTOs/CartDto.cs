namespace Backend.DTOs.CartDTOs;

public class CartDto
{
    public int? Id { get; set; }

    public List<CartItemDto> Items { get; set; } = [];

    public int TotalItems { get; set; }

    public decimal Subtotal { get; set; }
}