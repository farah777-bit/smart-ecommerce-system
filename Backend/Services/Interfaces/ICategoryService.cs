using Backend.DTOs.CategoryDTOs;

namespace Backend.Services.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetAllAsync();

    Task<CategoryDto?> GetByIdAsync(int id);

    Task<(CategoryDto? Category, string? Error)>
        CreateAsync(CreateCategoryDto createDto);

    Task<string?> UpdateAsync(
        int id,
        UpdateCategoryDto updateDto
    );

    Task<string?> DeleteAsync(int id);
}