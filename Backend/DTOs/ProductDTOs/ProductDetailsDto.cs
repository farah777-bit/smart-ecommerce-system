using Backend.DTOs.ProductImageDTOs;

namespace Backend.DTOs.ProductDTOs;

public class ProductDetailsDto : ProductDto
{
    public List<ProductImageDto> Images { get; set; }
        = new List<ProductImageDto>();

    public double AverageRating { get; set; }

    public int ReviewsCount { get; set; }

    public List<ProductReviewDto> Reviews { get; set; }
        = new List<ProductReviewDto>();
}