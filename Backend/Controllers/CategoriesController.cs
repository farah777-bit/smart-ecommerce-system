using Backend.Data;
using Backend.DTOs.CategoryDTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CategoriesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // GET: api/categories
    // Public
    // =====================================================

    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        var categories = await _context.Categories
            .Include(c => c.ParentCategory)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                ParentCategoryId = c.ParentCategoryId,
                ParentCategoryName = c.ParentCategory != null
                    ? c.ParentCategory.Name
                    : null
            })
            .ToListAsync();

        return Ok(categories);
    }

    // =====================================================
    // GET: api/categories/{id}
    // Public
    // =====================================================

    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.ParentCategory)
            .Where(c => c.Id == id)
            .Select(c => new CategoryDto
            {
                Id = c.Id,
                Name = c.Name,
                Description = c.Description,
                ImageUrl = c.ImageUrl,
                ParentCategoryId = c.ParentCategoryId,
                ParentCategoryName = c.ParentCategory != null
                    ? c.ParentCategory.Name
                    : null
            })
            .FirstOrDefaultAsync();

        if (category == null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        return Ok(category);
    }

    // =====================================================
    // POST: api/categories
    // Admin only
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> CreateCategory(
        CreateCategoryDto createDto)
    {
        if (string.IsNullOrWhiteSpace(createDto.Name))
        {
            return BadRequest(new
            {
                message = "Category name is required."
            });
        }

        var nameExists = await _context.Categories
            .AnyAsync(c => c.Name == createDto.Name);

        if (nameExists)
        {
            return BadRequest(new
            {
                message = "Category name already exists."
            });
        }

        if (createDto.ParentCategoryId.HasValue)
        {
            var parentExists = await _context.Categories
                .AnyAsync(c => c.Id == createDto.ParentCategoryId.Value);

            if (!parentExists)
            {
                return BadRequest(new
                {
                    message = "Parent category does not exist."
                });
            }
        }

        var category = new Category
        {
            Name = createDto.Name.Trim(),
            Description = createDto.Description,
            ImageUrl = createDto.ImageUrl,
            ParentCategoryId = createDto.ParentCategoryId
        };

        _context.Categories.Add(category);

        await _context.SaveChangesAsync();

        string? parentName = null;
        if (category.ParentCategoryId.HasValue)
        {
            parentName = await _context.Categories
                .Where(c => c.Id == category.ParentCategoryId.Value)
                .Select(c => c.Name)
                .FirstOrDefaultAsync();
        }

        var categoryDto = new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            Description = category.Description,
            ImageUrl = category.ImageUrl,
            ParentCategoryId = category.ParentCategoryId,
            ParentCategoryName = parentName
        };

        return CreatedAtAction(
            nameof(GetCategory),
            new { id = category.Id },
            categoryDto
        );
    }

    // =====================================================
    // PUT: api/categories/{id}
    // Admin only
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(
        int id,
        UpdateCategoryDto updateDto)
    {
        var category = await _context.Categories.FindAsync(id);

        if (category == null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        if (string.IsNullOrWhiteSpace(updateDto.Name))
        {
            return BadRequest(new
            {
                message = "Category name is required."
            });
        }

        var duplicateName = await _context.Categories
            .AnyAsync(c =>
                c.Name == updateDto.Name &&
                c.Id != id
            );

        if (duplicateName)
        {
            return BadRequest(new
            {
                message = "Category name already exists."
            });
        }

        if (updateDto.ParentCategoryId == id)
        {
            return BadRequest(new
            {
                message = "Category cannot be its own parent."
            });
        }

        if (updateDto.ParentCategoryId.HasValue)
        {
            var parentExists = await _context.Categories
                .AnyAsync(c =>
                    c.Id == updateDto.ParentCategoryId.Value
                );

            if (!parentExists)
            {
                return BadRequest(new
                {
                    message = "Parent category does not exist."
                });
            }
        }

        category.Name = updateDto.Name.Trim();
        category.Description = updateDto.Description;
        category.ImageUrl = updateDto.ImageUrl;
        category.ParentCategoryId = updateDto.ParentCategoryId;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // =====================================================
    // DELETE: api/categories/{id}
    // Admin only
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteCategory(int id)
    {
        var category = await _context.Categories
            .Include(c => c.Products)
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        if (category.Products.Any())
        {
            return BadRequest(new
            {
                message =
                    "Cannot delete a category that contains products."
            });
        }

        if (category.SubCategories.Any())
        {
            return BadRequest(new
            {
                message =
                    "Cannot delete a category that contains subcategories."
            });
        }

        _context.Categories.Remove(category);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}
