using Backend.DTOs.ProductImageDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class ProductImageService : IProductImageService
{
    private readonly IProductImageRepository _repository;

    public ProductImageService(IProductImageRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ProductImageDto>?> GetProductImagesAsync(
        int productId)
    {
        var productExists =
            await _repository.ProductExistsAsync(productId);

        if (!productExists)
        {
            return null;
        }

        var images =
            await _repository.GetByProductIdAsync(productId);

        return images.Select(MapToDto).ToList();
    }

    public async Task<ProductImageDto?> CreateProductImageAsync(
        CreateProductImageDto createDto)
    {
        var productExists =
            await _repository.ProductExistsAsync(createDto.ProductId);

        if (!productExists)
        {
            return null;
        }

        // إلغاء الصورة الرئيسية القديمة
        if (createDto.IsPrimary)
        {
            var productImages =
                await _repository.GetByProductIdAsync(createDto.ProductId);

            foreach (var image in productImages)
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

        await _repository.AddAsync(productImage);
        await _repository.SaveChangesAsync();

        return MapToDto(productImage);
    }

    public async Task<bool> SetPrimaryImageAsync(int id)
    {
        var image = await _repository.GetByIdAsync(id);

        if (image == null)
        {
            return false;
        }

        var productImages =
            await _repository.GetByProductIdAsync(image.ProductId);

        foreach (var productImage in productImages)
        {
            productImage.IsPrimary =
                productImage.Id == image.Id;
        }

        await _repository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteProductImageAsync(int id)
    {
        var image = await _repository.GetByIdAsync(id);

        if (image == null)
        {
            return false;
        }

        _repository.Delete(image);
        await _repository.SaveChangesAsync();

        return true;
    }

    private static ProductImageDto MapToDto(ProductImage image)
    {
        return new ProductImageDto
        {
            Id = image.Id,
            ProductId = image.ProductId,
            ImageUrl = image.ImageUrl,
            IsPrimary = image.IsPrimary
        };
    }
}