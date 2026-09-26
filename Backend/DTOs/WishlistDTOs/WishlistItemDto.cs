namespace Backend.DTOs.WishlistDTOs;

public class WishlistItemDto
{
    public int Id { get; set; }

    public int ProductId { get; set; }

    public string ProductName { get; set; } = string.Empty;

    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsInStock { get; set; }

    public DateTime AddedAt { get; set; }
}