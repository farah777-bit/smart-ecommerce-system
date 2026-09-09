namespace Backend.DTOs.ProductDTOs;

public class ProductReviewDto
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string UserFullName { get; set; } = string.Empty;

    public int Rating { get; set; }

    public string? Comment { get; set; }

    public DateTime CreatedAt { get; set; }
}