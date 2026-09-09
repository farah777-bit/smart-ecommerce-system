using Backend.DTOs.CategoryDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;

    public CategoryService(
        ICategoryRepository categoryRepository)
    {
        _categoryRepository = categoryRepository;
    }

    public async Task<IEnumerable<CategoryDto>> GetAllAsync()
    {
        var categories =
            await _categoryRepository.GetAllAsync();

        return categories.Select(MapToDto);
    }

    public async Task<CategoryDto?> GetByIdAsync(int id)
    {
        var category =
            await _categoryRepository.GetByIdAsync(id);

        if (category == null)
        {
            return null;
        }

        return MapToDto(category);
    }

    public async Task<(CategoryDto? Category, string? Error)>
        CreateAsync(CreateCategoryDto createDto)
    {
        if (string.IsNullOrWhiteSpace(createDto.Name))
        {
            return (
                null,
                "Category name is required."
            );
        }

        var trimmedName = createDto.Name.Trim();

        var nameExists =
            await _categoryRepository.NameExistsAsync(
                trimmedName
            );

        if (nameExists)
        {
            return (
                null,
                "Category name already exists."
            );
        }

        if (createDto.ParentCategoryId.HasValue)
        {
            var parentExists =
                await _categoryRepository.ExistsAsync(
                    createDto.ParentCategoryId.Value
                );

            if (!parentExists)
            {
                return (
                    null,
                    "Parent category does not exist."
                );
            }
        }

        var category = new Category
        {
            Name = trimmedName,
            Description = createDto.Description,
            ImageUrl = createDto.ImageUrl,
            ParentCategoryId =
                createDto.ParentCategoryId
        };

        await _categoryRepository.AddAsync(category);
        await _categoryRepository.SaveChangesAsync();

        // نقرأ التصنيف مجددًا للحصول على ParentCategory
        var createdCategory =
            await _categoryRepository.GetByIdAsync(
                category.Id
            );

        return (
            createdCategory == null
                ? MapToDto(category)
                : MapToDto(createdCategory),
            null
        );
    }

    public async Task<string?> UpdateAsync(
        int id,
        UpdateCategoryDto updateDto)
    {
        var category =
            await _categoryRepository.GetByIdAsync(id);

        if (category == null)
        {
            return "Category not found.";
        }

        if (string.IsNullOrWhiteSpace(updateDto.Name))
        {
            return "Category name is required.";
        }

        var trimmedName = updateDto.Name.Trim();

        var duplicateName =
            await _categoryRepository.NameExistsAsync(
                trimmedName,
                id
            );

        if (duplicateName)
        {
            return "Category name already exists.";
        }

        if (updateDto.ParentCategoryId == id)
        {
            return "Category cannot be its own parent.";
        }

        if (updateDto.ParentCategoryId.HasValue)
        {
            var parentExists =
                await _categoryRepository.ExistsAsync(
                    updateDto.ParentCategoryId.Value
                );

            if (!parentExists)
            {
                return "Parent category does not exist.";
            }
        }

        category.Name = trimmedName;
        category.Description = updateDto.Description;
        category.ImageUrl = updateDto.ImageUrl;
        category.ParentCategoryId =
            updateDto.ParentCategoryId;

        await _categoryRepository.SaveChangesAsync();
        return null;
    }

    public async Task<string?> DeleteAsync(int id)
    {
        var category =
            await _categoryRepository
                .GetByIdWithRelationsAsync(id);

        if (category == null)
        {
            return "Category not found.";
        }

        if (category.Products.Any())
        {
            return
                "Cannot delete a category that contains products.";
        }

        if (category.SubCategories.Any())
        {
            return
                "Cannot delete a category that contains subcategories.";
        }

        _categoryRepository.Delete(category);

        await _categoryRepository.SaveChangesAsync();

        return null;
    }

    private static CategoryDto MapToDto(
        Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            ParentCategoryId =
                category.ParentCategoryId,
            ParentCategoryName =
                category.ParentCategory?.Name
        };
    }
}