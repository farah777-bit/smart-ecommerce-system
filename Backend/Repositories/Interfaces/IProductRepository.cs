using Backend.DTOs.ProductDTOs;
using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProductRepository
{
    Task<(IReadOnlyList<ProductDto> Items, int TotalCount)>
        GetPagedAsync(
            string? search,
            int? categoryId,
            string? sortBy,
            int page,
            int pageSize
        );

    Task<ProductDto?> GetByIdAsync(int id);

    Task<Product?> GetEntityByIdAsync(int id);

    Task<Category?> GetCategoryByIdAsync(int categoryId);

    Task<bool> CategoryExistsAsync(int categoryId);

    Task AddAsync(Product product);

    void Delete(Product product);

    Task SaveChangesAsync();

    Task<ProductDetailsDto?> GetDetailsByIdAsync(int id);
}