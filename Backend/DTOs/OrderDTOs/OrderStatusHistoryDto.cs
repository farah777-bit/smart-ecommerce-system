namespace Backend.DTOs.OrderDTOs;

public class OrderStatusHistoryDto
{
    public int Id { get; set; }

    public string PreviousStatus { get; set; } = string.Empty;

    public string NewStatus { get; set; } = string.Empty;

    public DateTime ChangedAt { get; set; }

    public int? ChangedByUserId { get; set; }

    public string ChangedByUserName { get; set; } = string.Empty;
}