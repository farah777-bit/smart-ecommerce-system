using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implementations;

public class ProductImageRepository : IProductImageRepository
{
    private readonly ApplicationDbContext _context;

    public ProductImageRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ProductExistsAsync(int productId)
    {
        return await _context.Products
            .AnyAsync(p => p.Id == productId);
    }

    public async Task<List<ProductImage>> GetByProductIdAsync(int productId)
    {
        return await _context.ProductImages
            .Where(i => i.ProductId == productId)
            .OrderByDescending(i => i.IsPrimary)
            .ToListAsync();
    }

    public async Task<ProductImage?> GetByIdAsync(int id)
    {
        return await _context.ProductImages
            .FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task AddAsync(ProductImage productImage)
    {
        await _context.ProductImages.AddAsync(productImage);
    }

    public void Delete(ProductImage productImage)
    {
        _context.ProductImages.Remove(productImage);
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}