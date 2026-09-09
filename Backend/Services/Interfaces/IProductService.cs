using Backend.DTOs.Common;
using Backend.DTOs.ProductDTOs;

namespace Backend.Services.Interfaces;

public interface IProductService
{
    Task<PagedResult<ProductDto>> GetProductsAsync(
        string? search,
        int? categoryId,
        string? sortBy,
        int page,
        int pageSize
    );

    Task<ProductDto?> GetProductAsync(int id);

    Task<ProductDto> CreateProductAsync(CreateProductDto createDto);

    Task<bool> UpdateProductAsync(
        int id,
        UpdateProductDto updateDto
    );

    Task<bool> DeleteProductAsync(int id);
}