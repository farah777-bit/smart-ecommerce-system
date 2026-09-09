using Backend.Data;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repositories.Implementations;

public class ReviewRepository : IReviewRepository
{
    private readonly ApplicationDbContext _context;

    public ReviewRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<bool> ProductExistsAsync(int productId)
    {
        return await _context.Products
            .AnyAsync(product => product.Id == productId);
    }

    public async Task<bool> UserHasReviewedProductAsync(
        int userId,
        int productId
    )
    {
        return await _context.Reviews.AnyAsync(
            review =>
                review.UserId == userId &&
                review.ProductId == productId
        );
    }

    public async Task<Review?> GetByIdAsync(int reviewId)
    {
        return await _context.Reviews
            .FirstOrDefaultAsync(review => review.Id == reviewId);
    }

    public async Task AddAsync(Review review)
    {
        await _context.Reviews.AddAsync(review);
    }

    public void Delete(Review review)
    {
        _context.Reviews.Remove(review);
    }

    public async Task<bool> SaveChangesAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }
}