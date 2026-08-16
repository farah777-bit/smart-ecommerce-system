using Backend.Data;
using Backend.DTOs.ProductDTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =====================================================
    // GET: api/products
    // Public
    // Supports search + category filter
    // =====================================================

    [HttpGet]
    public async Task<ActionResult> GetProducts(
    string? search,
    int? categoryId,
    string? sortBy,
    int page = 1,
    int pageSize = 8)
    {
        if (page < 1)
            page = 1;

        if (pageSize < 1)
            pageSize = 8;

        var query = _context.Products
            .Where(p => p.IsActive)
            .AsQueryable();

        // ==============================
        // Search
        // ==============================

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(p =>
                p.Name.Contains(search) ||
                p.Description.Contains(search)
            );
        }

        // ==============================
        // Category Filter
        // ==============================

        if (categoryId.HasValue)
        {
            query = query.Where(p =>
                p.CategoryId == categoryId.Value
            );
        }

        // ==============================
        // Sorting
        // ==============================

        query = sortBy switch
        {
            "price-low" => query.OrderBy(p => p.Price),

            "price-high" => query.OrderByDescending(p => p.Price),

            "name" => query.OrderBy(p => p.Name),

            _ => query.OrderBy(p => p.Id)
        };

        // ==============================
        // Total Count
        // ==============================

        var totalCount = await query.CountAsync();

        // ==============================
        // Pagination
        // ==============================

        var products = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description,
                p.Price,
                p.StockQuantity,
                p.CategoryId,

                CategoryName = p.Category.Name,

                PrimaryImageUrl = p.Images
                    .Where(image => image.IsPrimary)
                    .Select(image => image.ImageUrl)
                    .FirstOrDefault()
            })
            .ToListAsync();

        // ==============================
        // Response
        // ==============================

        var totalPages = (int)Math.Ceiling(
            totalCount / (double)pageSize
        );

        return Ok(new
        {
            items = products,
            totalCount,
            page,
            pageSize,
            totalPages
        });
    }

    // =====================================================
    // GET: api/products/{id}
    // Public
    // =====================================================

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ProductDto>> GetProduct(int id)
    {
        var product = await _context.Products
            .Include(p => p.Category)
            .Where(p => p.Id == id)
            .Select(p => new ProductDto
            {
                Id = p.Id,
                CategoryId = p.CategoryId,
                CategoryName = p.Category.Name,
                Name = p.Name,
                Description = p.Description,
                SeoTitle = p.SeoTitle,
                SeoDescription = p.SeoDescription,
                Price = p.Price,
                StockQuantity = p.StockQuantity,
                LowStockThreshold = p.LowStockThreshold,
                IsActive = p.IsActive,
                CreatedAt = p.CreatedAt,
                UpdatedAt = p.UpdatedAt,
                PrimaryImageUrl = p.Images
                    .Where(i => i.IsPrimary)
                    .Select(i => i.ImageUrl)
                    .FirstOrDefault()
            })
            .FirstOrDefaultAsync();

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        return Ok(product);
    }

    // =====================================================
    // POST: api/products
    // Admin only
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductDto>> CreateProduct(
        CreateProductDto createDto)
    {
        if (string.IsNullOrWhiteSpace(createDto.Name))
        {
            return BadRequest(new
            {
                message = "Product name is required."
            });
        }

        if (createDto.Price < 0)
        {
            return BadRequest(new
            {
                message = "Price cannot be negative."
            });
        }
        if (createDto.StockQuantity < 0)
        {
            return BadRequest(new
            {
                message = "Stock quantity cannot be negative."
            });
        }

        if (createDto.LowStockThreshold < 0)
        {
            return BadRequest(new
            {
                message = "Low stock threshold cannot be negative."
            });
        }

        var category = await _context.Categories
            .FindAsync(createDto.CategoryId);

        if (category == null)
        {
            return BadRequest(new
            {
                message = "Category does not exist."
            });
        }

        var product = new Product
        {
            CategoryId = createDto.CategoryId,
            Name = createDto.Name.Trim(),
            Description = createDto.Description,
            SeoTitle = createDto.SeoTitle,
            SeoDescription = createDto.SeoDescription,
            Price = createDto.Price,
            StockQuantity = createDto.StockQuantity,
            LowStockThreshold = createDto.LowStockThreshold,
            IsActive = createDto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Products.Add(product);

        await _context.SaveChangesAsync();

        var productDto = new ProductDto
        {
            Id = product.Id,
            CategoryId = product.CategoryId,
            CategoryName = category.Name,
            Name = product.Name,
            Description = product.Description,
            SeoTitle = product.SeoTitle,
            SeoDescription = product.SeoDescription,
            Price = product.Price,
            StockQuantity = product.StockQuantity,
            LowStockThreshold = product.LowStockThreshold,
            IsActive = product.IsActive,
            CreatedAt = product.CreatedAt,
            UpdatedAt = product.UpdatedAt
        };

        return CreatedAtAction(
            nameof(GetProduct),
            new { id = product.Id },
            productDto
        );
    }

    // =====================================================
    // PUT: api/products/{id}
    // Admin only
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateProduct(
        int id,
        UpdateProductDto updateDto)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        if (string.IsNullOrWhiteSpace(updateDto.Name))
        {
            return BadRequest(new
            {
                message = "Product name is required."
            });
        }

        if (updateDto.Price < 0)
        {
            return BadRequest(new
            {
                message = "Price cannot be negative."
            });
        }

        if (updateDto.StockQuantity < 0)
        {
            return BadRequest(new
            {
                message = "Stock quantity cannot be negative."
            });
        }

        if (updateDto.LowStockThreshold < 0)
        {
            return BadRequest(new
            {
                message = "Low stock threshold cannot be negative."
            });
        }

        var categoryExists = await _context.Categories
            .AnyAsync(c => c.Id == updateDto.CategoryId);

        if (!categoryExists)
        {
            return BadRequest(new
            {
                message = "Category does not exist."
            });
        }

        product.CategoryId = updateDto.CategoryId;
        product.Name = updateDto.Name.Trim();
        product.Description = updateDto.Description;
        product.SeoTitle = updateDto.SeoTitle;
        product.SeoDescription = updateDto.SeoDescription;
        product.Price = updateDto.Price;
        product.StockQuantity = updateDto.StockQuantity;
        product.LowStockThreshold = updateDto.LowStockThreshold;
        product.IsActive = updateDto.IsActive;
        product.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // =====================================================
    // DELETE: api/products/{id}
    // Admin only
    // =====================================================

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        _context.Products.Remove(product);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}