using Backend.DTOs.Common;
using Backend.DTOs.ProductDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class ProductService : IProductService
{
    private readonly IProductRepository _productRepository;

    public ProductService(IProductRepository productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<PagedResult<ProductDto>> GetProductsAsync(
        string? search,
        int? categoryId,
        string? sortBy,
        int page,
        int pageSize)
    {
        if (page < 1)
            page = 1;

        if (pageSize < 1)
            pageSize = 8;

        var result = await _productRepository.GetPagedAsync(
            search,
            categoryId,
            sortBy,
            page,
            pageSize
        );

        return new PagedResult<ProductDto>
        {
            Items = result.Items,
            TotalCount = result.TotalCount,
            Page = page,
            PageSize = pageSize,

            TotalPages = (int)Math.Ceiling(
                result.TotalCount / (double)pageSize
            )
        };
    }

    public async Task<ProductDto?> GetProductAsync(int id)
    {
        return await _productRepository.GetByIdAsync(id);
    }

    public async Task<ProductDto> CreateProductAsync(
        CreateProductDto createDto)
    {
        ValidateProduct(
            createDto.Name,
            createDto.Price,
            createDto.StockQuantity,
            createDto.LowStockThreshold
        );

        var category =
            await _productRepository.GetCategoryByIdAsync(
                createDto.CategoryId
            );

        if (category == null)
        {
            throw new ArgumentException(
                "Category does not exist."
            );
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

        await _productRepository.AddAsync(product);
        await _productRepository.SaveChangesAsync();

        return new ProductDto
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
    }

    public async Task<bool> UpdateProductAsync(
        int id,
        UpdateProductDto updateDto)
    {
        ValidateProduct(
            updateDto.Name,
            updateDto.Price,
            updateDto.StockQuantity,
            updateDto.LowStockThreshold
        );

        var product =
            await _productRepository.GetEntityByIdAsync(id);

        if (product == null)
            return false;

        var categoryExists =
            await _productRepository.CategoryExistsAsync(
                updateDto.CategoryId
            );

        if (!categoryExists)
        {
            throw new ArgumentException(
                "Category does not exist."
            );
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

        await _productRepository.SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteProductAsync(int id)
    {
        var product =
            await _productRepository.GetEntityByIdAsync(id);

        if (product == null)
            return false;

        _productRepository.Delete(product);

        await _productRepository.SaveChangesAsync();

        return true;
    }

    private static void ValidateProduct(
        string name,
        decimal price,
        int stockQuantity,
        int lowStockThreshold)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException(
                "Product name is required."
            );
        }

        if (price < 0)
        {
            throw new ArgumentException(
                "Price cannot be negative."
            );
        }

        if (stockQuantity < 0)
        {
            throw new ArgumentException(
                "Stock quantity cannot be negative."
            );
        }

        if (lowStockThreshold < 0)
        {
            throw new ArgumentException(
                "Low stock threshold cannot be negative."
            );
        }
    }
}