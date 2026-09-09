using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface ICategoryRepository
{
    Task<List<Category>> GetAllAsync();

    Task<Category?> GetByIdAsync(int id);

    Task<Category?> GetByIdWithRelationsAsync(int id);

    Task<bool> ExistsAsync(int id);

    Task<bool> NameExistsAsync(
        string name,
        int? excludedCategoryId = null
    );

    Task AddAsync(Category category);

    void Delete(Category category);

    Task<bool> SaveChangesAsync();
}