using Backend.DTOs.ProductImageDTOs;

namespace Backend.Services.Interfaces;

public interface IProductImageService
{
    Task<List<ProductImageDto>?> GetProductImagesAsync(int productId);

    Task<ProductImageDto?> CreateProductImageAsync(
        CreateProductImageDto createDto);

    Task<bool> SetPrimaryImageAsync(int id);

    Task<bool> DeleteProductImageAsync(int id);
}