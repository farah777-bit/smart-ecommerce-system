using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IReviewRepository
{
    Task<bool> ProductExistsAsync(int productId);

    Task<bool> UserHasReviewedProductAsync(
        int userId,
        int productId
    );

    Task<Review?> GetByIdAsync(int reviewId);

    Task AddAsync(Review review);

    void Delete(Review review);

    Task<bool> SaveChangesAsync();
}