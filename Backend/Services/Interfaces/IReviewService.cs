using Backend.DTOs.ReviewDTOs;

namespace Backend.Services.Interfaces;

public interface IReviewService
{
    Task<ReviewOperationResult> CreateReviewAsync(
        int userId,
        int productId,
        CreateReviewDto reviewDto
    );

    Task<ReviewOperationResult> UpdateReviewAsync(
        int userId,
        int reviewId,
        UpdateReviewDto reviewDto
    );

    Task<ReviewOperationResult> DeleteReviewAsync(
        int userId,
        int reviewId
    );
}