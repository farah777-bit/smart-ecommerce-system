using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProductImageRepository
{
    Task<bool> ProductExistsAsync(int productId);

    Task<List<ProductImage>> GetByProductIdAsync(int productId);

    Task<ProductImage?> GetByIdAsync(int id);

    Task AddAsync(ProductImage productImage);

    void Delete(ProductImage productImage);

    Task SaveChangesAsync();
}