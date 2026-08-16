using Backend.Data;
using Backend.DTOs.ProductImageDTOs;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductImagesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ProductImagesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/productimages/product/5
    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<IEnumerable<ProductImageDto>>> GetProductImages(
        int productId)
    {
        var productExists = await _context.Products
            .AnyAsync(p => p.Id == productId);

        if (!productExists)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        var images = await _context.ProductImages
            .Where(i => i.ProductId == productId)
            .OrderByDescending(i => i.IsPrimary)
            .Select(i => new ProductImageDto
            {
                Id = i.Id,
                ProductId = i.ProductId,
                ImageUrl = i.ImageUrl,
                IsPrimary = i.IsPrimary
            })
            .ToListAsync();

        return Ok(images);
    }

    // POST: api/productimages
    // Admin only
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductImageDto>> CreateProductImage(
        CreateProductImageDto createDto)
    {
        if (string.IsNullOrWhiteSpace(createDto.ImageUrl))
        {
            return BadRequest(new
            {
                message = "Image URL is required."
            });
        }

        var productExists = await _context.Products
            .AnyAsync(p => p.Id == createDto.ProductId);

        if (!productExists)
        {
            return BadRequest(new
            {
                message = "Product does not exist."
            });
        }

        // إذا كانت الصورة الجديدة Primary
        // نزيل Primary عن أي صورة أخرى لنفس المنتج
        if (createDto.IsPrimary)
        {
            var currentPrimaryImages = await _context.ProductImages
                .Where(i =>
                    i.ProductId == createDto.ProductId &&
                    i.IsPrimary)
                .ToListAsync();

            foreach (var image in currentPrimaryImages)
            {
                image.IsPrimary = false;
            }
        }

        var productImage = new ProductImage
        {
            ProductId = createDto.ProductId,
            ImageUrl = createDto.ImageUrl.Trim(),
            IsPrimary = createDto.IsPrimary
        };

        _context.ProductImages.Add(productImage);

        await _context.SaveChangesAsync();

        var imageDto = new ProductImageDto
        {
            Id = productImage.Id,
            ProductId = productImage.ProductId,
            ImageUrl = productImage.ImageUrl,
            IsPrimary = productImage.IsPrimary
        };

        return Ok(imageDto);
    }

    // PUT: api/productimages/5/set-primary
    // Admin only
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/set-primary")]
    public async Task<IActionResult> SetPrimaryImage(int id)
    {
        var image = await _context.ProductImages
            .FirstOrDefaultAsync(i => i.Id == id);

        if (image == null)
        {
            return NotFound(new
            {
                message = "Image not found."
            });
        }

        var productImages = await _context.ProductImages
            .Where(i => i.ProductId == image.ProductId)
            .ToListAsync();

        foreach (var productImage in productImages)
        {
            productImage.IsPrimary =
                productImage.Id == image.Id;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }
    // DELETE: api/productimages/5
    // Admin only
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProductImage(int id)
    {
        var image = await _context.ProductImages
            .FirstOrDefaultAsync(i => i.Id == id);

        if (image == null)
        {
            return NotFound(new
            {
                message = "Image not found."
            });
        }

        _context.ProductImages.Remove(image);

        await _context.SaveChangesAsync();

        return NoContent();
    }
}