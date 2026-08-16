namespace Backend.DTOs.ProductDTOs;

public class UpdateProductDto
{
    public int CategoryId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string? SeoTitle { get; set; }

    public string? SeoDescription { get; set; }

    public decimal Price { get; set; }

    public int StockQuantity { get; set; }

    public int LowStockThreshold { get; set; }

    public bool IsActive { get; set; }
}