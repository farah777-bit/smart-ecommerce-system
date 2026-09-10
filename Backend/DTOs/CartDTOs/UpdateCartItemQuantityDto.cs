using System.ComponentModel.DataAnnotations;

namespace Backend.DTOs.CartDTOs;

public class UpdateCartItemQuantityDto
{
    [Range(1, 100)]
    public int Quantity { get; set; }
}