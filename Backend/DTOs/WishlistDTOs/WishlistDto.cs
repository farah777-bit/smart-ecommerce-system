namespace Backend.DTOs.WishlistDTOs;

public class WishlistDto
{
    public int Id { get; set; }

    public DateTime CreatedAt { get; set; }

    public List<WishlistItemDto> Items { get; set; }
        = new();
}