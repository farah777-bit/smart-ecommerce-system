using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.OrderDTOs;

public class UpdateOrderStatusDto
{
    [Required]
    public string Status { get; set; } = string.Empty;
}