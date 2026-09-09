using Backend.DTOs.CategoryDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(
        ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET: api/categories
    // Public
    [HttpGet]
    public async Task<
        ActionResult<IEnumerable<CategoryDto>>>
        GetCategories()
    {
        var categories =
            await _categoryService.GetAllAsync();

        return Ok(categories);
    }

    // GET: api/categories/5
    // Public
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>>
        GetCategory(int id)
    {
        var category =
            await _categoryService.GetByIdAsync(id);

        if (category == null)
        {
            return NotFound(new
            {
                message = "Category not found."
            });
        }

        return Ok(category);
    }

    // POST: api/categories
    // Admin only
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>>
        CreateCategory(CreateCategoryDto createDto)
    {
        var result =
            await _categoryService.CreateAsync(createDto);

        if (result.Error != null)
        {
            return BadRequest(new
            {
                message = result.Error
            });
        }

        return CreatedAtAction(
            nameof(GetCategory),
            new { id = result.Category!.Id },
            result.Category
        );
    }

    // PUT: api/categories/5
    // Admin only
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateCategory(
        int id,
        UpdateCategoryDto updateDto)
    {
        var error =
            await _categoryService.UpdateAsync(
                id,
                updateDto
            );

        if (error == "Category not found.")
        {
            return NotFound(new
            {
                message = error
            });
        }

        if (error != null)
        {
            return BadRequest(new
            {
                message = error
            });
        }

        return NoContent();
    }

    // DELETE: api/categories/5
    // Admin only
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult>
        DeleteCategory(int id)
    {
        var error =
            await _categoryService.DeleteAsync(id);

        if (error == "Category not found.")
        {
            return NotFound(new
            {
                message = error
            });
        }

        if (error != null)
        {
            return BadRequest(new
            {
                message = error
            });
        }

        return NoContent();
    }
}