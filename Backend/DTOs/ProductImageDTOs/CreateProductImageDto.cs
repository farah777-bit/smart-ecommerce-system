namespace Backend.DTOs.ProductImageDTOs;

public class CreateProductImageDto
{
    public int ProductId { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public bool IsPrimary { get; set; }
}