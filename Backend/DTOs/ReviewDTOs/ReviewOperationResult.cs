namespace Backend.DTOs.ReviewDTOs;

public enum ReviewOperationStatus
{
    Success,
    NotFound,
    Forbidden,
    Conflict,
    Failed
}

public class ReviewOperationResult
{
    public bool Succeeded { get; set; }

    public string Message { get; set; } = string.Empty;

    public int? ReviewId { get; set; }

    public ReviewOperationStatus Status { get; set; }
}