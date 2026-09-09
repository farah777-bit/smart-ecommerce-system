using Backend.DTOs.ReviewDTOs;
using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;

    public ReviewService(IReviewRepository reviewRepository)
    {
        _reviewRepository = reviewRepository;
    }

    public async Task<ReviewOperationResult> CreateReviewAsync(
        int userId,
        int productId,
        CreateReviewDto reviewDto
    )
    {
        var productExists =
            await _reviewRepository.ProductExistsAsync(productId);

        if (!productExists)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.NotFound,
                Message = "Product not found."
            };
        }

        var alreadyReviewed =
            await _reviewRepository.UserHasReviewedProductAsync(
                userId,
                productId
            );

        if (alreadyReviewed)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.Conflict,
                Message = "You have already reviewed this product."
            };
        }

        var review = new Review
        {
            UserId = userId,
            ProductId = productId,
            Rating = reviewDto.Rating,
            Comment = NormalizeComment(reviewDto.Comment),
            IsApproved = true,
            CreatedAt = DateTime.UtcNow
        };

        await _reviewRepository.AddAsync(review);

        var saved = await _reviewRepository.SaveChangesAsync();

        if (!saved)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.Failed,
                Message = "Could not create the review."
            };
        }

        return new ReviewOperationResult
        {
            Succeeded = true,
            Status = ReviewOperationStatus.Success,
            ReviewId = review.Id,
            Message = "Review created successfully."
        };
    }

    public async Task<ReviewOperationResult> UpdateReviewAsync(
        int userId,
        int reviewId,
        UpdateReviewDto reviewDto
    )
    {
        var review =
            await _reviewRepository.GetByIdAsync(reviewId);

        if (review == null)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.NotFound,
                Message = "Review not found."
            };
        }

        if (review.UserId != userId)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.Forbidden,
                Message = "You cannot update another user's review."
            };
        }

        review.Rating = reviewDto.Rating;
        review.Comment = NormalizeComment(reviewDto.Comment);

        // لاحقاً يمكن جعلها false عند إضافة موافقة الإدارة
        review.IsApproved = true;

        var saved = await _reviewRepository.SaveChangesAsync();

        if (!saved)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.Failed,
                Message = "No changes were saved."
            };
        }

        return new ReviewOperationResult
        {
            Succeeded = true,
            Status = ReviewOperationStatus.Success,
            ReviewId = review.Id,
            Message = "Review updated successfully."
        };
    }

    public async Task<ReviewOperationResult> DeleteReviewAsync(
        int userId,
        int reviewId
    )
    {
        var review =
            await _reviewRepository.GetByIdAsync(reviewId);
        if (review == null)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.NotFound,
                Message = "Review not found."
            };
        }

        if (review.UserId != userId)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.Forbidden,
                Message = "You cannot delete another user's review."
            };
        }

        _reviewRepository.Delete(review);

        var saved = await _reviewRepository.SaveChangesAsync();

        if (!saved)
        {
            return new ReviewOperationResult
            {
                Succeeded = false,
                Status = ReviewOperationStatus.Failed,
                Message = "Could not delete the review."
            };
        }

        return new ReviewOperationResult
        {
            Succeeded = true,
            Status = ReviewOperationStatus.Success,
            ReviewId = reviewId,
            Message = "Review deleted successfully."
        };
    }

    private static string? NormalizeComment(string? comment)
    {
        return string.IsNullOrWhiteSpace(comment)
            ? null
            : comment.Trim();
    }
}