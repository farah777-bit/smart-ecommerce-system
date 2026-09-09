using System.Security.Claims;
using Backend.DTOs.ReviewDTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Authorize]
[Route("api")]
public class ReviewsController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewsController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    // POST: api/products/{productId}/reviews
    [HttpPost("products/{productId:int}/reviews")]
    public async Task<IActionResult> CreateReview(
        int productId,
        CreateReviewDto reviewDto
    )
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid or missing user identity."
            });
        }

        var result = await _reviewService.CreateReviewAsync(
            userId.Value,
            productId,
            reviewDto
        );

        return ConvertResult(result, created: true);
    }

    // PUT: api/reviews/{reviewId}
    [HttpPut("reviews/{reviewId:int}")]
    public async Task<IActionResult> UpdateReview(
        int reviewId,
        UpdateReviewDto reviewDto
    )
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid or missing user identity."
            });
        }

        var result = await _reviewService.UpdateReviewAsync(
            userId.Value,
            reviewId,
            reviewDto
        );

        return ConvertResult(result);
    }

    // DELETE: api/reviews/{reviewId}
    [HttpDelete("reviews/{reviewId:int}")]
    public async Task<IActionResult> DeleteReview(int reviewId)
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                message = "Invalid or missing user identity."
            });
        }

        var result = await _reviewService.DeleteReviewAsync(
            userId.Value,
            reviewId
        );

        return ConvertResult(result);
    }

    private int? GetCurrentUserId()
    {
        var userIdValue =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        return int.TryParse(userIdValue, out var userId)
            ? userId
            : null;
    }

    private IActionResult ConvertResult(
        ReviewOperationResult result,
        bool created = false
    )
    {
        if (result.Succeeded)
        {
            var response = new
            {
                message = result.Message,
                reviewId = result.ReviewId
            };

            return created
                ? StatusCode(StatusCodes.Status201Created, response)
                : Ok(response);
        }

        var errorResponse = new
        {
            message = result.Message
        };

        return result.Status switch
        {
            ReviewOperationStatus.NotFound =>
                NotFound(errorResponse),

            ReviewOperationStatus.Forbidden =>
                StatusCode(
                    StatusCodes.Status403Forbidden,
                    errorResponse
                ),

            ReviewOperationStatus.Conflict =>
                Conflict(errorResponse),

            _ => StatusCode(
                StatusCodes.Status500InternalServerError,
                errorResponse
            )
        };
    }
}