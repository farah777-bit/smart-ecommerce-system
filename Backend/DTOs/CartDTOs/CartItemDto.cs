namespace Backend.DTOs.CartDTOs;

public class CartItemDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public string? PrimaryImageUrl { get; set; }

    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    public int StockQuantity { get; set; }

    public decimal TotalPrice { get; set; }
}