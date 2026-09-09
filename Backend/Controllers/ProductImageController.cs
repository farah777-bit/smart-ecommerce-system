using Backend.DTOs.ProductImageDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductImagesController : ControllerBase
{
    private readonly IProductImageService _service;

    public ProductImagesController(IProductImageService service)
    {
        _service = service;
    }

    // GET: api/productimages/product/5
    [HttpGet("product/{productId:int}")]
    public async Task<ActionResult<IEnumerable<ProductImageDto>>>
        GetProductImages(int productId)
    {
        var images =
            await _service.GetProductImagesAsync(productId);

        if (images == null)
        {
            return NotFound(new
            {
                message = "Product not found."
            });
        }

        return Ok(images);
    }

    // POST: api/productimages
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<ActionResult<ProductImageDto>>
        CreateProductImage(CreateProductImageDto createDto)
    {
        if (string.IsNullOrWhiteSpace(createDto.ImageUrl))
        {
            return BadRequest(new
            {
                message = "Image URL is required."
            });
        }

        var image =
            await _service.CreateProductImageAsync(createDto);

        if (image == null)
        {
            return BadRequest(new
            {
                message = "Product does not exist."
            });
        }

        return Ok(image);
    }

    // PUT: api/productimages/5/set-primary
    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}/set-primary")]
    public async Task<IActionResult> SetPrimaryImage(int id)
    {
        var success =
            await _service.SetPrimaryImageAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Image not found."
            });
        }

        return NoContent();
    }

    // DELETE: api/productimages/5
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteProductImage(int id)
    {
        var success =
            await _service.DeleteProductImageAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Image not found."
            });
        }

        return NoContent();
    }
}